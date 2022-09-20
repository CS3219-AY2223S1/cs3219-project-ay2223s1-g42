import { PrismaClient } from "@prisma/client";
import { updatePrismaQuestionsSummary } from "./logic/questions-summary";

export async function updateQuestionsSummary() {
  const prisma = new PrismaClient();
  try {
    await prisma.$connect();
    await updatePrismaQuestionsSummary(prisma);
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}
