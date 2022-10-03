import * as z from "nestjs-zod/z";
import { createZodDto } from "nestjs-zod/dto";

import { UserModel } from "../../zod/user";

const passwordZodString = z
  .string()
  .min(8, { message: "Password must be at least 8 characters" });

export const SignupSchema = UserModel.pick({
  email: true,
  username: true,
}).extend({
  password: passwordZodString,
});

export const SigninSchema = SignupSchema.pick({
  email: true,
  password: true,
});

export const ForgetPasswordSchema = UserModel.pick({
  email: true,
});

const ResetPasswordSchema = SignupSchema.pick({
  password: true,
}).extend({ token: z.string() });

export const EditableSchema = UserModel.pick({
  email: true,
  username: true,
  hashRt: true,
}).partial();

export const ChangePasswordInfoSchema = z.object({
  currentPassword: passwordZodString,
  newPassword: passwordZodString,
});

export const DeleteAccountInfoSchema = SignupSchema.pick({ password: true });

export class SignupCredentialsDto extends createZodDto(SignupSchema) {}
export class SigninCredentialsDto extends createZodDto(SigninSchema) {}
export class EditableCredentialsDto extends createZodDto(EditableSchema) {}
export class ForgetPasswordCredentialsDto extends createZodDto(
  ForgetPasswordSchema
) {}
export class ResetPasswordCredentialsDto extends createZodDto(
  ResetPasswordSchema
) {}
export class ChangePasswordInfoDto extends createZodDto(
  ChangePasswordInfoSchema
) {}
export class DeleteAccountInfoDto extends createZodDto(
  DeleteAccountInfoSchema
) {}
