import * as z from "nestjs-zod/z";
import { createZodDto } from "nestjs-zod/dto";

import { UserModel } from "../../zod";

export const SignupCredentials = UserModel.pick({
  email: true,
  username: true,
}).extend({
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

export const SigninCredentials = SignupCredentials.pick({
  email: true,
  password: true,
});

export const forgetPasswordCredentials = UserModel.pick({
  email: true,
});

const resetPasswordCredentialsSchema = z.object({
  token: z.string(),
  newPassword: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

export const EditableCredentials = UserModel.pick({
  email: true,
  username: true,
  hashRt: true,
}).partial();

export class SignupCredentialsDto extends createZodDto(SignupCredentials) {}
export class SigninCredentialsDto extends createZodDto(SigninCredentials) {}
export class EditableCredentialsDto extends createZodDto(EditableCredentials) {}
export class forgetPasswordCredentialsDto extends createZodDto(
  forgetPasswordCredentials
) {}
export class resetPasswordCredentialsDto extends createZodDto(
  resetPasswordCredentialsSchema
) {}
