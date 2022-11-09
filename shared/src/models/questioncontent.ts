import * as z from "zod";

import {
  CompleteQuestionSummary,
  QuestionSummaryModel,
  CompleteQuestionHint,
  QuestionHintModel,
} from "./index";

export const _QuestionContentModel = z.object({
  id: z.number().int(),
  content: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  titleSlug: z.string(),
});

export interface CompleteQuestionContent
  extends z.infer<typeof _QuestionContentModel> {
  summary?: CompleteQuestionSummary;
  hints?: CompleteQuestionHint[];
}

/**
 * QuestionContentModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const QuestionContentModel: z.ZodSchema<CompleteQuestionContent> =
  z.lazy(() =>
    _QuestionContentModel.extend({
      summary: QuestionSummaryModel,
      hints: QuestionHintModel.array(),
    })
  );
