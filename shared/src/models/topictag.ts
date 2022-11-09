import * as z from "zod";

import { CompleteQuestionSummary, QuestionSummaryModel } from "./index";

export const _TopicTagModel = z.object({
  id: z.number().int(),
  topicSlug: z.string(),
});

export interface CompleteTopicTag extends z.infer<typeof _TopicTagModel> {
  questionSummaries?: CompleteQuestionSummary[];
}

/**
 * TopicTagModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const TopicTagModel: z.ZodSchema<CompleteTopicTag> = z.lazy(() =>
  _TopicTagModel.extend({
    questionSummaries: QuestionSummaryModel.array(),
  })
);
