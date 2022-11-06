import { z } from "zod";

import { MessageResponse } from "../types";
import { UserInfo } from "./schema";
import { UserHistoryModel } from "../../models";

type GetMeResponse = UserInfo;
type GetUserResponse = UserInfo;
type EditUserResponse = MessageResponse;
type DeleteUserResponse = UserInfo;

type UserHistory = Pick<
  z.infer<typeof UserHistoryModel>,
  | "id"
  | "titleSlug"
  | "content"
  | "createdAt"
  | "updatedAt"
  | "username"
  | "title"
>;

export type {
  GetMeResponse,
  GetUserResponse,
  EditUserResponse,
  DeleteUserResponse,
  UserHistory,
};
