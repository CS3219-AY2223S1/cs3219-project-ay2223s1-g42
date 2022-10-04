import { MessageResponse } from "../types";
import { UserInfo } from "./schema";

type GetMeResponse = UserInfo;
type GetUserResponse = UserInfo;
type EditUserResponse = MessageResponse;
type DeleteUserResponse = UserInfo;

export type {
  GetMeResponse,
  GetUserResponse,
  EditUserResponse,
  DeleteUserResponse,
};
