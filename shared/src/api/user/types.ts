import { z } from "zod";

import { MessageResponse } from "../types";
import { UserInfo } from "./schema";
import { AttemptModel } from "../../models";

type GetMeResponse = UserInfo;
type GetUserResponse = UserInfo;
type EditUserResponse = MessageResponse;
type DeleteUserResponse = UserInfo;

type Attempt = Pick<
  z.infer<typeof AttemptModel>,
  | "titleSlug"
  | "content"
  | "createdAt"
  | "updatedAt"
  | "userId"
  | "roomId"
  | "title"
>;

export type {
  GetMeResponse,
  GetUserResponse,
  EditUserResponse,
  DeleteUserResponse,
  Attempt,
};
