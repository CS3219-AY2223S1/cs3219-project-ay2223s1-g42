import { PrismaClient } from "@prisma/client";
import { logger } from "firebase-functions";

import {
  getExistingQuestionContents,
  insertQuestionContent,
} from "../api/questions-content";

export async function updatePrismaQuestionsContent(prisma: PrismaClient) {
  try {
    // Get old and new values
    const currContentMap = await getExistingQuestionContents(prisma);
    const currSummarySlugs = await prisma.questionSummary.findMany({
      select: { titleSlug: true },
    });

    // Remove stale values, if exists
    const currContentSlugs = new Set(Object.keys(currContentMap));
    const newSummarySlugs = new Set(currSummarySlugs.map((v) => v.titleSlug));

    // Stale slugs -- stale ones are ignored, refer to updatedAt
    // const currMinusUpdated = [...currContentSlugs].filter((key) => {
    //   return !newSummarySlugs.has(key);
    // });
    // await purgeStaleQuestionContent(prisma, currMinusUpdated);

    // New slugs
    const updatedMinusCurr = [...newSummarySlugs].filter((key) => {
      return !currContentSlugs.has(key);
    });

    // Upsert remaining data, if exist, AC rate, tags; else insert
    await insertQuestionContent(prisma, updatedMinusCurr);

    // Try to ensure that daily question has content
    await dailyQuestionCheck(prisma);
  } catch (error) {
    logger.error(error);
  }
}

async function dailyQuestionCheck(prisma: PrismaClient) {
  // Ensure that daily question has content
  const dailyQuestionSlug = await prisma.questionSummary.findMany({
    where: { isDailyQuestion: true },
    select: { titleSlug: true, QuestionContent: true },
  });

  // Throw error if not 1 dailyQuestion
  if (dailyQuestionSlug.length !== 1) {
    throw new Error(`number of daily questions: ${dailyQuestionSlug.length}`);
  }

  // If no content, get question content
  if (!dailyQuestionSlug[0].QuestionContent?.content) {
    await insertQuestionContent(
      prisma,
      dailyQuestionSlug.map((v) => v.titleSlug)
    );
  }
}
