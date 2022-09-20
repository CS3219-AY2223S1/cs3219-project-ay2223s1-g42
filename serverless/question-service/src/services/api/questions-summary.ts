import { PrismaClient } from "@prisma/client";
import axios from "axios";

import {
  ALL_QUESTIONS_QUERY,
  LEETCODE_GRAPHQL_ENDPOINT,
} from "../../constants/graphql.queries";
import {
  NormalisedQuestionSummaryType,
  QuestionSummaryListType,
} from "../../constants/graphql.types";

export async function getInitialPrismaRows(prisma: PrismaClient) {
  // const questionsMap: Record<string, NormalisedQuestionSummaryType> = {};
  // prisma.questionSummary.findMany().then((questions) => {
  //   for (const { id, createdAt, updatedAt, titleSlug, ...info } of questions) {
  //     questionsMap[titleSlug] = { ...info, titleSlug };
  //   }
  // });
}

// export async function createMany(
//   prisma: PrismaClient,
//   questionMap: Record<string, NormalisedQuestionSummaryType>
// ) {
//   for (const [titleSlug, question] of Object.entries(questionMap)) {
//     const { topicTags, ...info } = question;
//     await prisma.questionSummary.upsert({
//       where: { titleSlug },
//       create: {
//         ...info,
//         topicTags: {
//           connectOrCreate: topicTags.map((topic) => {
//             return {
//               where: { name: topic },
//               create: { name: topic },
//             };
//           }),
//         },
//       },
//       update: { ...question },
//     });
//   }
// }

export async function updatePrismaQuestionsSummary(
  prisma: PrismaClient,
  questionMap: Record<string, NormalisedQuestionSummaryType>
) {
  for (const [titleSlug, question] of Object.entries(questionMap)) {
    const { topicTags, acRate, ...info } = question;
    await prisma.questionSummary.upsert({
      where: { titleSlug },
      create: {
        ...info,
        acRate,
        topicTags: {
          connectOrCreate: topicTags.map((topic) => {
            return {
              where: { name: topic },
              create: { name: topic },
            };
          }),
        },
      },
      update: {
        acRate,
        // topicTags: {
        //   connectOrCreate: topicTags.map((topic) => {
        //     return {
        //       where: { name: topic },
        //       create: { name: topic },
        //     };
        //   }),
        // },
      },
    });
  }
}

export async function getLeetcodeQuestions() {
  const questionMap: Record<string, NormalisedQuestionSummaryType> = {};
  const { data } = await axios.post<QuestionSummaryListType>(
    LEETCODE_GRAPHQL_ENDPOINT,
    ALL_QUESTIONS_QUERY,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!data) {
    throw new Error("unable to get questions from leetcode");
  }
  for (const q of data.data.psetQuestionList.questions) {
    questionMap[q.titleSlug] = {
      acRate: q.acRate,
      difficulty: q.difficulty,
      hasSolution: q.hasSolution,
      hasVideoSolution: q.hasVideoSolution,
      paidOnly: q.paidOnly,
      title: q.title,
      titleSlug: q.titleSlug,
      topicTags: q.topicTags.map((t) => t.slug),
    };
  }
  return questionMap;
}
