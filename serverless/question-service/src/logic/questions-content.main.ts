import { PrismaClient } from "@prisma/client";
import { logger } from "firebase-functions";

import { updatePrismaQuestionsContent } from "./questions-content";

export async function updateQuestionsContent() {
  const prisma = new PrismaClient();
  try {
    await prisma.$connect();
    await updatePrismaQuestionsContent(prisma);
  } catch (error) {
    logger.error(error);
  } finally {
    await prisma.$disconnect();
  }
}
