import * as z from "zod";

import { CompleteQuestionContent, QuestionContentModel } from "./index";

export const _QuestionHintModel = z.object({
  hintId: z.number().int(),
  hint: z.string().nullish(),
  questionContentId: z.number().int(),
});

export interface CompleteQuestionHint
  extends z.infer<typeof _QuestionHintModel> {
  QuestionContent?: CompleteQuestionContent;
}

/**
 * QuestionHintModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const QuestionHintModel: z.ZodSchema<CompleteQuestionHint> = z.lazy(() =>
  _QuestionHintModel.extend({
    QuestionContent: QuestionContentModel,
  })
);
