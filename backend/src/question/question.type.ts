import { Prisma } from "@prisma/client";

// * Based on available data

export const QUESTION_SUMMARY_SELECT =
  Prisma.validator<Prisma.QuestionSummarySelect>()({
    acRate: true,
    difficulty: true,
    title: true,
    titleSlug: true,
    topicTags: { select: { topicSlug: true } },
    updatedAt: true,
  });

type ExtraFields = {
  topicTags: string[];
  discussionLink: string;
};

export type FlattenedQuestionContent = {
  content: string;
  hints: string[];
} & ExtraFields;

export type QuestionSummaryFromDb = Prisma.QuestionSummaryGetPayload<{
  select: typeof QUESTION_SUMMARY_SELECT;
}>;

export type FlattenedQuestionSummary = Omit<
  QuestionSummaryFromDb,
  "topicTags"
> &
  ExtraFields;
