import * as z from "nestjs-zod/z";
import { createZodDto } from "nestjs-zod/dto";

import { UserModel } from "../../zod/user";

export const SignupSchema = UserModel.pick({
  email: true,
  username: true,
}).extend({
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
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

export class SignupCredentialsDto extends createZodDto(SignupSchema) {}
export class SigninCredentialsDto extends createZodDto(SigninSchema) {}
export class EditableCredentialsDto extends createZodDto(EditableSchema) {}
export class ForgetPasswordCredentialsDto extends createZodDto(
  ForgetPasswordSchema
) {}
export class ResetPasswordCredentialsDto extends createZodDto(
  ResetPasswordSchema
) {}
