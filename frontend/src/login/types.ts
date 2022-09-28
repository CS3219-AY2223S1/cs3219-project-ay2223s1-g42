import { z } from "zod";

export type ApiResponse = {
  message: string;
};

// schemas
export const UserSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  username: z.string().min(4).max(20),
});
export const SignupCredentialsSchema = UserSchema.pick({
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
export const ForgetPasswordInfoSchema = UserSchema.pick({ email: true });
export const ResetPasswordInfoSchema = SignupCredentialsSchema.pick({
  password: true,
});

// schema types
export type User = z.infer<typeof UserSchema>;
export type SignUpCredentials = z.infer<typeof SignupCredentialsSchema>;
export type SignInCredentials = z.infer<typeof SigninCredentialsSchema>;
export type ForgetPasswordInfo = z.infer<typeof ForgetPasswordInfoSchema>;
export type ResetPasswordInfo = z.infer<typeof ResetPasswordInfoSchema>;

export type FormType = "signup" | "signin";
export type FormProps = {
  setForm: (form: FormType) => void;
};
