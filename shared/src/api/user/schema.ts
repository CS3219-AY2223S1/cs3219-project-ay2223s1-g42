import { z } from "zod";

import { UserModel } from "../../types";

const UserInfoSchema = UserModel.pick({
  id: true,
  email: true,
  username: true,
});

const UserHashInfoSchema = UserModel.pick({
  id: true,
  email: true,
  username: true,
  hash: true,
  hashRt: true,
});

const EditableSchema = UserModel.pick({
  email: true,
  username: true,
  hashRt: true,
}).partial();

type UserInfo = z.infer<typeof UserInfoSchema>;
type UserHashInfo = z.infer<typeof UserHashInfoSchema>;

export { EditableSchema, UserInfoSchema, UserHashInfoSchema };
export type { UserInfo, UserHashInfo };
