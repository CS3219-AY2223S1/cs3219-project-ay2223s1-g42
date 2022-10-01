import { z } from "zod";

import { UserModel } from "../../types";

// schemas
const passwordZodString = z
  .string()
  .min(8, { message: "Password must be at least 8 characters" });

const SignupSchema = z.object({
  username: UserModel.shape.username,
  email: UserModel.shape.email,
  password: passwordZodString,
});

const SigninSchema = SignupSchema.pick({
  email: true,
  password: true,
});

const ForgetPasswordSchema = SignupSchema.pick({
  email: true,
});

const ResetPasswordSchema = SignupSchema.pick({
  password: true,
}).extend({ token: z.string() });

const ChangePasswordInfoSchema = z
  .object({
    currentPassword: passwordZodString,
    newPassword: passwordZodString,
  })
  .superRefine(({ currentPassword, newPassword }, ctx) => {
    if (newPassword === currentPassword) {
      ctx.addIssue({
        code: "custom",
        message: "New password is the same as old password",
      });
    }
  });

const DeletePasswordSchema = SignupSchema.pick({
  password: true,
});

const EditableCredentialsSchema = SignupSchema.pick({
  username: true,
});

const DeleteAccountInfoSchema = SignupSchema.pick({
  password: true,
});

// schema types
type SignupData = z.infer<typeof SignupSchema>;
type SigninData = z.infer<typeof SigninSchema>;
type ForgetPasswordData = z.infer<typeof ForgetPasswordSchema>;
type ResetPasswordData = z.infer<typeof ResetPasswordSchema>;
type ChangePasswordData = z.infer<typeof ChangePasswordInfoSchema>;
type DeletePasswordData = z.infer<typeof DeletePasswordSchema>;
type EditableCredentials = z.infer<typeof EditableCredentialsSchema>;
type DeleteAccountData = z.infer<typeof DeleteAccountInfoSchema>;

export {
  SignupSchema,
  SigninSchema,
  ForgetPasswordSchema,
  ResetPasswordSchema,
  ChangePasswordInfoSchema,
  DeletePasswordSchema,
  EditableCredentialsSchema,
  DeleteAccountInfoSchema,
};

export type {
  SignupData,
  SigninData,
  ForgetPasswordData,
  ResetPasswordData,
  ChangePasswordData,
  DeletePasswordData,
  EditableCredentials,
  DeleteAccountData,
};
