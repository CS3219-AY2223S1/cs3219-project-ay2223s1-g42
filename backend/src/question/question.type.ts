import { QuestionSummary } from "@prisma/client";

export type QuestionSummaryTableType = Pick<
  QuestionSummary,
  "acRate" | "difficulty" | "title" | "titleSlug" | "updatedAt"
> & { topicTags: { topicSlug: string }[] };

export type NormalisedSummaryType = Omit<
  QuestionSummaryTableType,
  "topicTags"
> & {
  topicTags: string[];
};
