import { QuestionHint, QuestionSummary } from "@prisma/client";

export type QuestionSummaryType = {
  acRate: number;
  difficulty: string;
  paidOnly: boolean;
  title: string;
  titleSlug: string;
  topicTags: { slug: string }[];
  hasSolution: boolean;
  hasVideoSolution: boolean;
};

export type QuestionSummaryListType = {
  data: {
    psetQuestionList: {
      questions: QuestionSummaryType[];
    };
  };
};

export type QuestionContentType = {
  data: {
    question: {
      content: string;
      hints: string[];
      topicTags: { name: string }[];
    };
  };
};

export type NormalisedQuestionSummaryType = Omit<
  QuestionSummary,
  "createdAt" | "updatedAt" | "id"
> & {
  isDailyQuestion: boolean;
  topicTags: string[];
};

export type NormalisedQuestionContentType = {
  content: Buffer;
  hints: QuestionHint[];
  titleSlug: string;
};

export type LeetcodeContentType = Omit<
  NormalisedQuestionContentType,
  "hints"
> & {
  hints: Buffer[];
};
