import { z } from "nestjs-zod/z";
import { UserModel } from "src/zod";

export const UserInfoSchema = UserModel.pick({
  id: true,
  email: true,
  username: true,
});

const PublicUserInfo = UserModel.pick({
  id: true,
  email: true,
  username: true,
});

export type PublicUserInfo = z.infer<typeof PublicUserInfo>;
