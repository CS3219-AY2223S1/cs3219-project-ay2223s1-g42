import { PrismaClient } from "@prisma/client";

export async function updatePrismaQuestionsSummary(prisma: PrismaClient) {
  return prisma.questionSummary.findMany();
}
