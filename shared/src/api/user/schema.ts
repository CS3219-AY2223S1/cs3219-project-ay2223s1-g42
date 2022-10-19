import { z } from "zod";

import { _UserModel } from "../../models";

const UserInfoSchema = _UserModel.pick({
  id: true,
  email: true,
  username: true,
  provider: true,
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

const OauthInfoSchema = _UserModel.pick({
  id: true,
  email: true,
  username: true,
  provider: true,
});

type UserInfo = z.infer<typeof UserInfoSchema>;
type UserHashInfo = z.infer<typeof UserHashInfoSchema>;
type OauthUserInfo = z.infer<typeof OauthInfoSchema>;

export { EditableSchema, UserInfoSchema, UserHashInfoSchema, OauthInfoSchema };
export type { UserInfo, UserHashInfo, OauthUserInfo };
