import { z } from "zod";

import { _UserModel } from "../../models";

const UserInfoSchema = _UserModel.pick({
  id: true,
  email: true,
  username: true,
});

const UserHashInfoSchema = _UserModel.pick({
  id: true,
  email: true,
  username: true,
  hash: true,
  hashRt: true,
});

const EditableSchema = _UserModel
  .pick({
    email: true,
    username: true,
    hashRt: true,
  })
  .partial();

type UserInfo = z.infer<typeof UserInfoSchema>;
type UserHashInfo = z.infer<typeof UserHashInfoSchema>;

export { EditableSchema, UserInfoSchema, UserHashInfoSchema };
export type { UserInfo, UserHashInfo };
