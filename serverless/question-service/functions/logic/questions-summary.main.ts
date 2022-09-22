import { PrismaClient } from "@prisma/client";
import { logger } from "firebase-functions";

import { updatePrismaQuestionSummaries } from "./questions-summary";

export async function updateQuestionsSummary(url: string) {
  const prisma = new PrismaClient({ datasources: { db: { url } } });

  try {
    const oldCount = await prisma.questionSummary.count();
    await updatePrismaQuestionSummaries(prisma);
    const newCount = await prisma.questionSummary.count();

    logger.info("summary update completed");
    logger.info(`${newCount - oldCount} were added`);
  } catch (error) {
    logger.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

// (async () => {
//   const p = new PrismaClient({
//     datasources: { db: { url: "mysql://root@127.0.0.1:3306/main" } },
//   });
//   p.questionSummary
//     .deleteMany()
//     .then((v) => console.log({ table: "summary", v }));
//   p.topicTag.deleteMany().then((v) => console.log({ table: "tag", v }));
//   p.questionHint.deleteMany().then((v) => console.log({ table: "hint", v }));
//   p.questionContent
//     .deleteMany()
//     .then((v) => console.log({ table: "content", v }));
// })();
