import { Prisma } from "@prisma/client";

// * Based on available data

export const QUESTION_CONTENT_SELECT =
  Prisma.validator<Prisma.QuestionContentSelect>()({
    content: true,
    hints: true,
    summary: {
      include: {
        topicTags: true,
      },
    },
    titleSlug: true,
  });

export const QUESTION_SUMMARY_SELECT =
  Prisma.validator<Prisma.QuestionSummarySelect>()({
    acRate: true,
    difficulty: true,
    title: true,
    titleSlug: true,
    topicTags: { select: { topicSlug: true } },
    createdAt: true,
    updatedAt: true,
  });

export type QuestionContentFromDb = Prisma.QuestionContentGetPayload<{
  select: typeof QUESTION_CONTENT_SELECT;
}>;

export type QuestionSummaryFromDb = Prisma.QuestionSummaryGetPayload<{
  select: typeof QUESTION_SUMMARY_SELECT;
}>;
