import { PrismaClient } from "@prisma/client";
import { logger } from "firebase-functions";

import {
  getExistingQuestionContents,
  insertQuestionContent,
  purgeStaleQuestionContent,
} from "../api/questions-content";
import { wait } from "../utils/concurrency";

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

    // Stale slugs
    const currMinusUpdated = [...currContentSlugs].filter((key) => {
      return !newSummarySlugs.has(key);
    });
    await purgeStaleQuestionContent(prisma, currMinusUpdated);

    // New slugs
    const updatedMinusCurr = [...newSummarySlugs].filter((key) => {
      return !currContentSlugs.has(key);
    });
    // Upsert remaining data, if exist, AC rate, tags; else insert
    await insertQuestionContent(prisma, updatedMinusCurr);
  } catch (error) {
    logger.error(error);
  }
}
