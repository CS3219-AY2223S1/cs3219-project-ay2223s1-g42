import { z } from "zod";

import { UserModel } from "../../types";

const UserInfoSchema = UserModel.pick({
  id: true,
  email: true,
  username: true,
});

const EditableSchema = UserModel.pick({
  email: true,
  username: true,
  hashRt: true,
}).partial();

export type UserInfo = z.infer<typeof UserInfoSchema>;

export { EditableSchema, UserInfoSchema };
