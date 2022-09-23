import { PrismaClient } from "@prisma/client";
import axios from "axios";
import { logger } from "firebase-functions";
import { isEmpty } from "lodash";

import {
  ALL_QUESTIONS_QUERY,
  LEETCODE_GRAPHQL_ENDPOINT,
  QUESTION_OF_THE_DAY_QUERY,
} from "../constants/graphql.queries";
import {
  NormalisedQuestionSummaryType,
  QuestionSummaryListType,
} from "../constants/graphql.types";

// ***** Prisma ***** //

export async function getExistingQuestionSummary(prisma: PrismaClient) {
  const questionsMap: Record<string, NormalisedQuestionSummaryType> = {};
  const dbQuestions = await prisma.questionSummary.findMany({
    include: { topicTags: true },
  });

  if (isEmpty(dbQuestions)) {
    logger.info("summary database is empty");
    return questionsMap;
  }

  for (const question of dbQuestions) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { createdAt, updatedAt, titleSlug, topicTags, ...info } = question;
    questionsMap[titleSlug] = {
      ...info,
      titleSlug,
      topicTags: topicTags.map((v) => v.topicSlug),
    };
  }

  return questionsMap;
}

export async function upsertQuestionsSummary(
  prisma: PrismaClient,
  questionMap: Record<string, NormalisedQuestionSummaryType>
) {
  for (const [titleSlug, question] of Object.entries(questionMap)) {
    const { topicTags, acRate, isDailyQuestion, ...info } = question;
    try {
      await prisma.questionSummary.upsert({
        where: { titleSlug },
        update: {
          acRate,
          isDailyQuestion, // handles updating QOTD
          topicTags: {
            connectOrCreate: topicTags.map((topic) => {
              return {
                where: { topicSlug: topic.toLowerCase() },
                create: { topicSlug: topic.toLowerCase() },
              };
            }),
          },
        },
        create: {
          acRate,
          isDailyQuestion, // in case new question becomes QOTD
          topicTags: {
            connectOrCreate: topicTags.map((topic) => {
              return {
                where: { topicSlug: topic.toLowerCase() },
                create: { topicSlug: topic.toLowerCase() },
              };
            }),
          },
          ...info,
        },
      });
    } catch (error) {
      logger.error(`unable to upsert ${titleSlug} -- ${error}`);
    }
  }
  logger.info("successfully updated data questions summary");
}

export async function purgeStaleQuestionSummary(
  prisma: PrismaClient,
  staleSummaryMap: Record<string, NormalisedQuestionSummaryType>
) {
  const oldTitleSlugs = Object.keys(staleSummaryMap);
  if (oldTitleSlugs.length == 0) {
    return;
  }

  // Delete entry
  try {
    await prisma.questionSummary.deleteMany({
      where: {
        titleSlug: {
          in: oldTitleSlugs,
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

export async function getLeetcodeQuestions() {
  const questionMap: Record<string, NormalisedQuestionSummaryType> = {};
  const { data } = await axiosInstance.post<QuestionSummaryListType>(
    LEETCODE_GRAPHQL_ENDPOINT,
    ALL_QUESTIONS_QUERY
  );

  if (!data) {
    logger.error("unable to get LC questions");
    return questionMap;
  }

  logger.info("successfully pulled questions summary from LeetCode");

  for (const q of data.data.psetQuestionList.questions) {
    if (q.paidOnly) {
      continue;
    }
    const { topicTags, ...info } = q;
    questionMap[q.titleSlug] = {
      ...info,
      topicTags: topicTags.map((topic) => topic.slug),
      isDailyQuestion: false,
    };
  }

  return questionMap;
}

// This assumes that the daily question already exists in the database
export async function getDailyQuestion() {
  const { data } = await axiosInstance.post(
    LEETCODE_GRAPHQL_ENDPOINT,
    QUESTION_OF_THE_DAY_QUERY
  );

  if (!data) {
    logger.error("unable to get question of the day");
    return "";
  }

  logger.info(
    `daily question: ${data.data.activeDailyCodingChallengeQuestion.question.titleSlug}`
  );
  return data.data.activeDailyCodingChallengeQuestion.question.titleSlug;
}
