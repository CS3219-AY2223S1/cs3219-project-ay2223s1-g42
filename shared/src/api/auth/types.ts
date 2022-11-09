import { MessageResponse } from "../types";

type SignupResponse = MessageResponse;
type SigninResponse = MessageResponse;
type SignoutResponse = MessageResponse;
type RefreshResponse = MessageResponse;
type VerifyEmailResponse = MessageResponse;
type ForgetPasswordResponse = MessageResponse;
type ResetPasswordResponse = MessageResponse;
type ChangePasswordResponse = MessageResponse;
type DeleteAccountResponse = MessageResponse;
type OauthLoginResponse = MessageResponse;

export type {
  SignupResponse,
  SigninResponse,
  SignoutResponse,
  RefreshResponse,
  VerifyEmailResponse,
  ForgetPasswordResponse,
  ResetPasswordResponse,
  ChangePasswordResponse,
  DeleteAccountResponse,
  OauthLoginResponse,
};
