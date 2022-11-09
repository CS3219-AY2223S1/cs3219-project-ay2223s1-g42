import * as z from "zod";

import {
  CompleteTopicTag,
  TopicTagModel,
  CompleteQuestionContent,
  QuestionContentModel,
} from "./index";

export const _QuestionSummaryModel = z.object({
  id: z.number().int(),
  acRate: z.number(),
  difficulty: z.string(),
  paidOnly: z.boolean(),
  title: z.string(),
  titleSlug: z.string(),
  isDailyQuestion: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export interface CompleteQuestionSummary
  extends z.infer<typeof _QuestionSummaryModel> {
  topicTags?: CompleteTopicTag[];
  QuestionContent?: CompleteQuestionContent | null;
}

/**
 * QuestionSummaryModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const QuestionSummaryModel: z.ZodSchema<CompleteQuestionSummary> =
  z.lazy(() =>
    _QuestionSummaryModel.extend({
      topicTags: TopicTagModel.array(),
      QuestionContent: QuestionContentModel.nullish(),
    })
  );
