import { Prisma } from "@prisma/client";

export const questionSummarySelect =
  Prisma.validator<Prisma.QuestionSummarySelect>()({
    acRate: true,
    difficulty: true,
    title: true,
    titleSlug: true,
    topicTags: { select: { topicSlug: true } },
    updatedAt: true,
  });

export type QuestionSummaryFromDb = Prisma.QuestionSummaryGetPayload<{
  select: typeof questionSummarySelect;
}>;

export type FlattenedQuestionSummary = Omit<
  QuestionSummaryFromDb,
  "topicTags"
> & { topicTags: string[] };
