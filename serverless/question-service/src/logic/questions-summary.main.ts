import { PrismaClient } from "@prisma/client";
import { logger } from "firebase-functions";

import { updatePrismaQuestionSummaries } from "./questions-summary";

export async function updateQuestionsSummary() {
  const prisma = new PrismaClient();
  try {
    await prisma.$connect();
    await updatePrismaQuestionSummaries(prisma);
  } catch (error) {
    logger.error(error);
  } finally {
    await prisma.$disconnect();
  }
}
