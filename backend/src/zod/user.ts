import * as z from "nestjs-zod/z";
import { createZodDto } from "nestjs-zod/dto";

export const UserModel = z.object({
  id: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
  username: z.string().min(4).max(20),
  email: z.string().email({ message: "Invalid email address" }),
  hash: z.string(),
});

export const UserInfo = UserModel.pick({ username: true, email: true });

export class UserDto extends createZodDto(UserModel) {}
export class UserInfoDto extends createZodDto(UserInfo) {}
