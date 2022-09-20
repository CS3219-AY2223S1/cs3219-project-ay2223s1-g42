import { PrismaClient } from "@prisma/client";
import {
  getLeetcodeQuestions,
  updatePrismaQuestionsSummary,
} from "./services/api/questions-summary";

const prisma = new PrismaClient();

async function main() {
  const questionsMap = await getLeetcodeQuestions();
  await updatePrismaQuestionsSummary(prisma, questionsMap);
  prisma.questionSummary
    .findFirst({
      where: { titleSlug: { equals: "two-sum" } },
      include: { topicTags: true },
    })
    .then((res) =>
      console.log({ ...res, tags: res?.topicTags.map((v) => v.name) })
    );
  prisma.questionSummary
    .findFirst({ include: { topicTags: true } })
    .then((res) => console.log(res));
  prisma.topicTag
    .findMany({
      where: {
        AND: [
          { name: { equals: "array" } },
          { name: { equals: "hash-table" } },
        ],
      },
      include: { questions: true, _count: true },
    })
    .then((res) => console.log(res));
  prisma.topicTag
    .findFirst({
      include: { questions: true },
      where: { name: { equals: "doubly-linked-list" } },
    })
    .then((res) => console.log(res));
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
