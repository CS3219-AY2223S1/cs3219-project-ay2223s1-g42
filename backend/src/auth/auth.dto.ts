import { createZodDto } from "@anatine/zod-nestjs";
import { extendApi } from "@anatine/zod-openapi";

import {
  ChangePasswordInfoSchema,
  DeleteAccountInfoSchema,
  EditableSchema,
  ForgetPasswordSchema,
  OauthInfoScehma,
  QuerySchema,
  QuestionQuerySchema,
  ResetPasswordSchema,
  SigninSchema,
  SignupSchema,
} from "shared/api";
import { API_OPERATIONS } from "src/utils";

const SignupApi = extendApi(SignupSchema, {
  title: "Sign up API",
  description: API_OPERATIONS.SIGN_UP_SUMMARY,
});

const SigninApi = extendApi(SigninSchema, {
  title: "Sign in API",
  description: API_OPERATIONS.SIGN_IN_SUMMARY,
});

const EditUserApi = extendApi(EditableSchema, {
  title: "Edit user API",
  description: API_OPERATIONS.EDIT_USER_INFO_SUMMARY,
});

const ForgetPasswordApi = extendApi(ForgetPasswordSchema, {
  title: "Forget password API",
  description: API_OPERATIONS.FORGET_PASSWORD_SUMMARY,
});

const ResetPasswordApi = extendApi(ResetPasswordSchema, {
  title: "Reset password API",
  description: API_OPERATIONS.RESET_PASSWORD_SUMMARY,
});

const ChangePasswordApi = extendApi(ChangePasswordInfoSchema, {
  title: "Change password API",
  description: API_OPERATIONS.CHANGE_PASSWORD_SUMMARY,
});

const DeleteAccountApi = extendApi(DeleteAccountInfoSchema, {
  title: "Delete account API",
  description: API_OPERATIONS.DELETE_ACCOUNT_SUMMARY,
});

const QueryApi = extendApi(QuerySchema, {
  title: "Query API",
  description: "API_OPERATIONS.QUERY_SUMMARY",
});

const OauthApi = extendApi(OauthInfoScehma, {
  title: "Oauth API",
  description: "API_OPERATIONS.OAUTH_SUMMARY",
});

export class SignupCredentialsDto extends createZodDto(SignupApi) {}
export class SigninCredentialsDto extends createZodDto(SigninApi) {}
export class EditableCredentialsDto extends createZodDto(EditUserApi) {}
export class ForgetPasswordCredentialsDto extends createZodDto(
  ForgetPasswordApi
) {}
export class ResetPasswordCredentialsDto extends createZodDto(
  ResetPasswordApi
) {}
export class QuestionQueriesDto extends createZodDto(QuestionQuerySchema) {}
export class ChangePasswordInfoDto extends createZodDto(ChangePasswordApi) {}
export class DeleteAccountInfoDto extends createZodDto(DeleteAccountApi) {}
export class QueryDto extends createZodDto(QueryApi) {}
export class OauthDto extends createZodDto(OauthApi) {}
