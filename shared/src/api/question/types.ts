import { z } from "zod";

import { QuestionContentModel, QuestionSummaryModel } from "../../models";

export enum QuestionDifficulty {
  EASY = "easy",
  MEDIUM = "medium",
  HARD = "hard",
}

type ExtraSummaryFields = {
  topicTags: string[];
  discussionLink: string;
};

type ExtraContentFields = ExtraSummaryFields & {
  hints: string[];
};

// prisma model types
type PublicQuestionContent = Pick<
  z.infer<typeof QuestionContentModel>,
  "content" | "hints" | "summary" | "titleSlug"
>;

type PublicQuestionSummary = Pick<
  z.infer<typeof QuestionSummaryModel>,
  "acRate" | "difficulty" | "title" | "titleSlug" | "topicTags" | "updatedAt"
>;

type FlattenedQuestionContent = Pick<PublicQuestionContent, "content"> &
  ExtraContentFields;

type FlattenedQuestionSummary = Omit<PublicQuestionSummary, "topicTags"> &
  ExtraSummaryFields;

// API response types
type GetSummariesResponse = FlattenedQuestionSummary[];
type GetDailyQuestionSummaryResponse = FlattenedQuestionSummary;
type GetAllTopicsResponse = string[];
type GetDailyQuestionContentResponse = FlattenedQuestionContent;
type GetSlugContentResponse = FlattenedQuestionContent;

export type {
  PublicQuestionContent,
  PublicQuestionSummary,
  FlattenedQuestionContent,
  FlattenedQuestionSummary,
  GetSummariesResponse,
  GetDailyQuestionSummaryResponse,
  GetAllTopicsResponse,
  GetDailyQuestionContentResponse,
  GetSlugContentResponse,
};
