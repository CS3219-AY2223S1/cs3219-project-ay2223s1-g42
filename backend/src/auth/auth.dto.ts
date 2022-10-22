import { createZodDto } from "@anatine/zod-nestjs";
import { extendApi } from "@anatine/zod-openapi";
import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

import {
  ChangePasswordInfoSchema,
  DeleteAccountInfoSchema,
  EditableSchema,
  ForgetPasswordSchema,
  OauthInfoSchema,
  OauthQuerySchema,
  ResetPasswordSchema,
  SigninSchema,
  SignupSchema,
} from "shared/api";
import { API_OPERATIONS } from "src/utils";
import { string } from "zod";

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

const OauthQueryApi = extendApi(OauthQuerySchema, {
  title: "Oauth query API",
  description: "API_OPERATIONS.QUERY_SUMMARY",
});

const OauthApi = extendApi(OauthInfoSchema, {
  title: "Oauth API",
  description: "API_OPERATIONS.OAUTH_SUMMARY",
});

export class SignupCredentialsDto extends createZodDto(SignupApi) {
  @IsString({ each: true })
  @ApiProperty({
    type: string,
    description: "username of the user",
  })
  public username: string;
  @IsString({ each: true })
  @ApiProperty({
    type: string,
    description: "email of the user",
  })
  public email: string;
  @IsString({ each: true })
  @ApiProperty({
    type: string,
    description: "password of the user",
  })
  public password: string;
}
export class SigninCredentialsDto extends createZodDto(SigninApi) {
  @IsString({ each: true })
  @ApiProperty({
    type: string,
    description: "email of the user",
  })
  public email: string;
  @IsString({ each: true })
  @ApiProperty({
    type: string,
    description: "password of the user",
  })
  public password: string;
}
export class EditableCredentialsDto extends createZodDto(EditUserApi) {}
export class ForgetPasswordCredentialsDto extends createZodDto(
  ForgetPasswordApi
) {
  @IsString({ each: true })
  @ApiProperty({
    type: string,
    description: "Email the user signed up PeerPrep with",
  })
  public email: string;
}
export class ResetPasswordCredentialsDto extends createZodDto(
  ResetPasswordApi
) {
  @IsString({ each: true })
  @ApiProperty({
    type: string,
    description: "Password the user wish to change to",
  })
  public password: string;
  @IsString({ each: true })
  @ApiProperty({
    type: string,
    description: "Access token",
  })
  public token: string;
}
export class ChangePasswordInfoDto extends createZodDto(ChangePasswordApi) {
  @IsString({ each: true })
  @ApiProperty({
    type: string,
    description: "Current password user is using",
  })
  public currentPassword: string;
  @IsString({ each: true })
  @ApiProperty({
    type: string,
    description: "Password the user wish to change to",
  })
  public newPassword: string;
}
export class DeleteAccountInfoDto extends createZodDto(DeleteAccountApi) {
  @IsString({ each: true })
  @ApiProperty({
    type: string,
    description: "The current password of the user",
  })
  public password: string;
}
export class OauthQueryDto extends createZodDto(OauthQueryApi) {
  @IsString({ each: true })
  @ApiProperty({
    type: string,
    description: "The token provided by GitHub for OAuth",
  })
  public code: string;
}
export class OauthDto extends createZodDto(OauthApi) {}
