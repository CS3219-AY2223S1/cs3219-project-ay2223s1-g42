import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.questionSummary.create({
    data: {
      acRate: 49.06167991960814,
      difficulty: "Easy",
      paidOnly: false,
      title: "Three Sum",
      titleSlug: "three-sum",
      topicTags: {
        connectOrCreate: {
          create: [{ name: "array" }, { name: "hash-table" }],
          // where: [{ name: "array" }, { name: "hash-table" }],
        },
      },
      hasSolution: true,
      hasVideoSolution: true,
    },
  });
  const allUsers = await prisma.questionSummary.findMany();
  console.log(allUsers);
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
