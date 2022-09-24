import { Prisma } from "@prisma/client";

// * Based on available data

export const questionSummarySelect =
  Prisma.validator<Prisma.QuestionSummarySelect>()({
    acRate: true,
    difficulty: true,
    title: true,
    titleSlug: true,
    topicTags: { select: { topicSlug: true } },
    updatedAt: true,
  });

export type FlattenedQuestionContent = {
  content: string;
  hints: string[];
  topicTags: string[];
};

export type QuestionSummaryFromDb = Prisma.QuestionSummaryGetPayload<{
  select: typeof questionSummarySelect;
}>;

export type FlattenedQuestionSummary = Omit<
  QuestionSummaryFromDb,
  "topicTags"
> & { topicTags: string[] };
