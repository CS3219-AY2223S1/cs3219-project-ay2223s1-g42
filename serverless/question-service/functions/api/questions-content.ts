import { PrismaClient } from "@prisma/client";
import axios from "axios";
import { logger } from "firebase-functions";
import { isEmpty } from "lodash";

import {
  getQuestionFromSlug,
  LEETCODE_GRAPHQL_ENDPOINT,
} from "../constants/graphql.queries";
import {
  LeetcodeContentType,
  NormalisedQuestionContentType,
  QuestionContentResponse,
} from "../constants/graphql.types";
import { processConcurrently } from "../utils/concurrency";

// ***** Prisma ***** //

export async function getExistingQuestionContents(prisma: PrismaClient) {
  const contentMap: Record<string, NormalisedQuestionContentType> = {};
  const dbQuestionContent = await prisma.questionContent.findMany({
    include: { hints: true },
  });

  if (isEmpty(dbQuestionContent)) {
    logger.info("content database is empty");
    return dbQuestionContent;
  }

  for (const { titleSlug, content, hints } of dbQuestionContent) {
    const hintMap: Record<number, string> = {};

    for (const { hintId, hint } of hints) {
      if (hint) {
        hintMap[hintId] = hint;
      }
    }

    contentMap[titleSlug] = {
      content,
      hints,
      titleSlug,
    };
  }

  return contentMap;
}

export async function insertQuestionContent(
  prisma: PrismaClient,
  newSlugs: string[]
) {
  try {
    const lcData = await getLcQuestionContent(newSlugs);
    for (const { content, hints, titleSlug } of Object.values(lcData)) {
      await prisma.questionContent.create({
        data: {
          content,
          hints: {
            create: hints.map((v) => {
              return { hint: v };
            }),
          },
          titleSlug: titleSlug.toLowerCase(),
        },
      });
    }
  } catch (error) {
    logger.error(error);
  }
}

export async function purgeStaleQuestionContent(
  prisma: PrismaClient,
  staleContentSet: string[]
) {
  if (staleContentSet.length === 0) {
    return;
  }

  try {
    await prisma.questionContent.deleteMany({
      where: {
        titleSlug: {
          in: staleContentSet,
        },
      },
    });
  } catch (error) {
    logger.error(error);
  }
}

// ***** GraphQL-LeetCode ***** //

const axiosInstance = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

async function getLcQuestionContent(titleSlugs: string[]) {
  const lcMap: Record<string, LeetcodeContentType> = {};
  const getLcContentFuncs: (() => Promise<void>)[] = [];
  for (const titleSlug of titleSlugs) {
    getLcContentFuncs.push(async () => {
      try {
        const { data } = await axiosInstance.post<QuestionContentResponse>(
          LEETCODE_GRAPHQL_ENDPOINT,
          getQuestionFromSlug(titleSlug)
        );
        const { content, hints } = data.data.question;
        lcMap[titleSlug] = {
          content,
          hints,
          titleSlug,
        };
      } catch (error) {}
    });
  }
  await processConcurrently(getLcContentFuncs, 10);

  if (titleSlugs.length) {
    logger.info([
      { leftover: titleSlugs.length },
      { resolved: Object.keys(lcMap).length },
    ]);
  }

  return normaliseLcQuestionContent(lcMap);
}

// ***** Util function ***** //

function normaliseLcQuestionContent(
  lcMap: Record<string, LeetcodeContentType>
): Record<
  string,
  Omit<NormalisedQuestionContentType, "hints"> & {
    hints: string[];
  }
> {
  const normalisedMap: Record<
    string,
    Omit<NormalisedQuestionContentType, "hints"> & {
      hints: string[];
    }
  > = {};
  for (const [titleSlug, data] of Object.entries(lcMap)) {
    normalisedMap[titleSlug] = {
      content: data.content,
      hints: data.hints,
      titleSlug,
    };
  }
  return normalisedMap;
}
