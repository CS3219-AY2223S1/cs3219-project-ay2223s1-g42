import { PrismaClient } from "@prisma/client";

async function getInitialPrismaRows(prisma: PrismaClient) {
  const questionSummaryRows = getPrismaQuestionRows(prisma);
}

export async function updatePrismaQuestionsSummary(prisma: PrismaClient) {}
