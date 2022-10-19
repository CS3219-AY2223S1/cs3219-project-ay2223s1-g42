import * as z from "zod";

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
