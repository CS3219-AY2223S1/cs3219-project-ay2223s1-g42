import { PrismaClient } from "@prisma/client";
import axios from "axios";
import { logger } from "firebase-functions";

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

  if (!dbQuestions) {
    logger.info("database is empty");
  }

  for (const question of dbQuestions) {
    const { createdAt, updatedAt, titleSlug, topicTags, ...info } = question;
    questionsMap[titleSlug] = {
      ...info,
      titleSlug,
      topicTags: topicTags.map((v) => v.name),
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
                where: { name: topic.toLowerCase() },
                create: { name: topic.toLowerCase() },
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
                where: { name: topic.toLowerCase() },
                create: { name: topic.toLowerCase() },
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

  // ? Not needed as referentialIntegrity is enabled and
  // ? allows cascading deletion/disconnects
  // Disconnect relation
  // for (const slug of oldTitleSlugs) {
  //   await prisma.questionSummary.update({
  //     where: { titleSlug: slug },
  //     data: {
  //       topicTags: { disconnect: [] },
  //     },
  //     include: { topicTags: true },
  //   });
  // }

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
    questionMap[q.titleSlug] = {
      acRate: q.acRate,
      difficulty: q.difficulty,
      hasSolution: q.hasSolution,
      hasVideoSolution: q.hasVideoSolution,
      paidOnly: q.paidOnly,
      title: q.title,
      titleSlug: q.titleSlug,
      isDailyQuestion: false, //intialise all qns as false
      topicTags: q.topicTags.map((t) => t.slug),
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
