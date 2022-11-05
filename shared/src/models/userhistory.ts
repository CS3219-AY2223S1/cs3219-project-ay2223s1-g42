import * as z from "zod";

import { CompleteUser, UserModel } from "./index";

export const _UserHistoryModel = z.object({
  id: z.number().int(),
  titleSlug: z.string(),
  content: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  username: z.string().nullish(),
});

export interface CompleteUserHistory extends z.infer<typeof _UserHistoryModel> {
  User?: CompleteUser | null;
}

/**
 * UserHistoryModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const UserHistoryModel: z.ZodSchema<CompleteUserHistory> = z.lazy(() =>
  _UserHistoryModel.extend({
    User: UserModel.nullish(),
  })
);
