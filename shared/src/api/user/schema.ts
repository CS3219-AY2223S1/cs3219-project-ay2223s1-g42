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
  provider: true,
});

const EditableSchema = _UserModel
  .pick({
    email: true,
    username: true,
    hashRt: true,
  })
  .partial();

const OauthInfoScehma = _UserModel.pick({
  id: true,
  email: true,
  username: true,
  provider: true,
});

type UserInfo = z.infer<typeof UserInfoSchema>;
type UserHashInfo = z.infer<typeof UserHashInfoSchema>;
type OauthUserInfo = z.infer<typeof OauthInfoScehma>;

export { EditableSchema, UserInfoSchema, UserHashInfoSchema, OauthInfoScehma };
export type { UserInfo, UserHashInfo, OauthUserInfo };
