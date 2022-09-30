import * as z from "zod";

import { UserModel } from "src/types";

const passwordZodString = z
  .string()
  .min(8, { message: "Password must be at least 8 characters" });

const SignupSchema = UserModel.pick({
  email: true,
  username: true,
}).extend({
  password: passwordZodString,
});

const SigninSchema = SignupSchema.pick({
  email: true,
  password: true,
});

const ForgetPasswordSchema = UserModel.pick({
  email: true,
});

const ResetPasswordSchema = SignupSchema.pick({
  password: true,
}).extend({ token: z.string() });

const ChangePasswordInfoSchema = z.object({
  currentPassword: passwordZodString,
  newPassword: passwordZodString,
});

const DeletePasswordSchema = SignupSchema.pick({
  password: true,
});

export {
  SignupSchema,
  SigninSchema,
  ForgetPasswordSchema,
  ResetPasswordSchema,
  ChangePasswordInfoSchema,
  DeletePasswordSchema,
};
