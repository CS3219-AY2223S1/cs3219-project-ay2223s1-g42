import { z } from "zod";

import { CompleteUser, UserModel } from "./index";

export const _AttemptModel = z.object({
  title: z.string(),
  titleSlug: z.string(),
  content: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  userId: z.number(),
  roomId: z.string(),
});

export interface CompleteAttempt extends z.infer<typeof _AttemptModel> {
  User?: CompleteUser | null;
}

/**
 * AttemptModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const AttemptModel: z.ZodSchema<CompleteAttempt> = z.lazy(() =>
  _AttemptModel.extend({
    User: UserModel.nullish(),
  })
);
