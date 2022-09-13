import * as z from "nestjs-zod/z";
import { createZodDto } from "nestjs-zod/dto";

import { UserModel } from "../../zod";

export const SignupCredentialsSchema = UserModel.pick({
  email: true,
  username: true,
}).extend({
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

export const SigninCredentialsSchema = SignupCredentialsSchema.pick({
  email: true,
  password: true,
});

export const EditableCredentialsSchema = UserModel.pick({
  email: true,
  username: true,
  hashRt: true,
}).partial();

export type SignUpCredentials = z.infer<typeof SignupCredentialsSchema>;
export type SignInCredentials = z.infer<typeof SigninCredentialsSchema>;
export type EditableCredentials = z.infer<typeof EditableCredentialsSchema>;

export class SignupCredentialsDto extends createZodDto(
  SignupCredentialsSchema
) {}
export class SigninCredentialsDto extends createZodDto(
  SigninCredentialsSchema
) {}
export class EditableCredentialsDto extends createZodDto(
  EditableCredentialsSchema
) {}
