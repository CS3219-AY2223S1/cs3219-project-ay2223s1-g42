import { PrismaClient } from "@prisma/client";
import { logger } from "firebase-functions";

import {
  getDailyQuestion,
  getLeetcodeQuestions,
  upsertQuestionsSummary,
} from "../api/questions-summary";

export async function updatePrismaQuestionSummaries(prisma: PrismaClient) {
  try {
    // Get existing and new summaries
    // const currentSummaryMap = await getExistingQuestionSummary(prisma);
    const updatedSummaryMap = await getLeetcodeQuestions();

    //// Remove stale summaries, if exists
    // Ignore stale questions -- refer to updatedAt
    // const currentTitleSlugs = new Set(Object.keys(currentSummaryMap));
    // const updatedTitleSlugs = new Set(Object.keys(updatedSummaryMap));
    // const staleSummaryMap: Record<string, NormalisedQuestionSummaryType> = {};
    // [...currentTitleSlugs]
    //   .filter((key) => {
    //     return !updatedTitleSlugs.has(key);
    //   })
    //   .forEach((slug) => (staleSummaryMap[slug] = currentSummaryMap[slug]));
    // await purgeStaleQuestionSummary(prisma, staleSummaryMap);

    // Update daily question, getLeetcodeQuestions defaults all to false
    const dailyQuestionTitleSlug = await getDailyQuestion();
    if (dailyQuestionTitleSlug) {
      updatedSummaryMap[dailyQuestionTitleSlug].isDailyQuestion = true;
    }

    // Upsert remaining summaries, if exist, AC rate, tags; else insert
    await upsertQuestionsSummary(prisma, updatedSummaryMap);
  } catch (error) {
    logger.error(error);
  }
}
