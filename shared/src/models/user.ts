import * as z from "zod";

import { CompleteUserHistory, UserHistoryModel } from "./index";

export const _UserModel = z.object({
  id: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
  /**
   * @z.string().min(4).max(20)
   */
  username: z.string(),
  /**
   * @z.string().email({ message: "Invalid email address" })
   */
  email: z.string(),
  hash: z.string(),
  hashRt: z.string().nullish(),
  provider: z.string(),
});

export interface CompleteUser extends z.infer<typeof _UserModel> {
  history?: CompleteUserHistory[];
}

/**
 * UserModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const UserModel: z.ZodSchema<CompleteUser> = z.lazy(() =>
  _UserModel.extend({
    history: UserHistoryModel.array(),
  })
);
