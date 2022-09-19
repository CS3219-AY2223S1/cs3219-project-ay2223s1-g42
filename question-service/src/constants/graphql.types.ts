import { QuestionSummary } from "@prisma/client";

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
  topicTags: string[];
};
