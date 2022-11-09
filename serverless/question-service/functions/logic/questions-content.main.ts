import { PrismaClient } from "@prisma/client";
import { logger } from "firebase-functions";

import { updatePrismaQuestionsContent } from "./questions-content";

export async function updateQuestionsContent(url: string) {
  const prisma = new PrismaClient({ datasources: { db: { url } } });
  try {
    const oldCount = await prisma.questionContent.count();
    await updatePrismaQuestionsContent(prisma);
    const newCount = await prisma.questionContent.count();

    logger.info("content update completed");
    logger.info(`${newCount - oldCount} were added`);
  } catch (error) {
    logger.error(error);
  } finally {
    await prisma.$disconnect();
  }
}
