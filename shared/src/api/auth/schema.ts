import { z } from "zod";

import { UserModel } from "../../types";

const passwordZodString = z
  .string()
  .min(8, { message: "Password must be at least 8 characters" });

const SignupSchema = z.object({
  username: UserModel.shape.username,
  email: UserModel.shape.email,
  password: passwordZodString,
});

type SignupData = z.infer<typeof SignupSchema>;

const SigninSchema = SignupSchema.pick({
  email: true,
  password: true,
});

type SigninData = z.infer<typeof SigninSchema>;

const ForgetPasswordSchema = UserModel.pick({
  email: true,
});

type ForgetPasswordData = z.infer<typeof ForgetPasswordSchema>;

const ResetPasswordSchema = SignupSchema.pick({
  password: true,
}).extend({ token: z.string() });

type ResetPasswordData = z.infer<typeof ResetPasswordSchema>;

const ChangePasswordInfoSchema = z.object({
  currentPassword: passwordZodString,
  newPassword: passwordZodString,
});

type ChangePasswordInfoData = z.infer<typeof ChangePasswordInfoSchema>;

const DeletePasswordSchema = SignupSchema.pick({
  password: true,
});

type DeletePasswordData = z.infer<typeof DeletePasswordSchema>;

export {
  SignupSchema,
  SigninSchema,
  ForgetPasswordSchema,
  ResetPasswordSchema,
  ChangePasswordInfoSchema,
  DeletePasswordSchema,
};

export type {
  SignupData,
  SigninData,
  ForgetPasswordData,
  ResetPasswordData,
  ChangePasswordInfoData,
  DeletePasswordData,
};
