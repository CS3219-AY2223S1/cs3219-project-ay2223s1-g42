import { z } from "zod";

export const UserModel = z.object({
  id: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
  username: z.string().min(4).max(20),
  email: z.string().email({ message: "Invalid email address" }),
  hash: z.string(),
  hashRt: z.string().nullish(),
});

export type User = z.infer<typeof UserModel>;
