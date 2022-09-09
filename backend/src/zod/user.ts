import * as z from "nestjs-zod/z"
import { createZodDto } from "nestjs-zod/dto"

export const UserModel = z.object({
  id: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
  username: z.string().min(4).max(20),
  email: z.string().email({ message: "Invalid email address" }),
  hash: z.string(),
  hashRt: z.string().nullish(),
});

const PublicUserInfo = UserModel.pick({
  id: true,
  email: true,
  username: true,
});

export type PublicUserInfo = z.infer<typeof PublicUserInfo>;

export class UserDto extends createZodDto(UserModel) {}
