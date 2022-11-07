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

// attempt
const AttemptInfoSchema = z.object({
  content: z.string(),
  titleSlug: z.string(),
  title: z.string(),
  roomId: z.string(),
});

type AttemptInfo = z.infer<typeof AttemptInfoSchema>;

export {
  EditableSchema,
  UserInfoSchema,
  UserHashInfoSchema,
  OauthInfoSchema,
  AttemptInfoSchema,
};
export type { UserInfo, UserHashInfo, OauthUserInfo, AttemptInfo };
