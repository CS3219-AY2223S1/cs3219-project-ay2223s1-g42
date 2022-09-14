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
export const EditableCredentialsSchema = UserSchema.pick({
  email: true,
  username: true,
}).partial();
export const ForgetPasswordInfoSchema = UserSchema.pick({ email: true });

// schema types
export type User = z.infer<typeof UserSchema>;
export type SignUpCredentials = z.infer<typeof SignupCredentialsSchema>;
export type SignInCredentials = z.infer<typeof SigninCredentialsSchema>;
export type EditableCredentials = z.infer<typeof EditableCredentialsSchema>;
export type ForgetPasswordInfo = z.infer<typeof ForgetPasswordInfoSchema>;

export type FormType = "signup" | "signin";
export type FormProps = {
  setForm: (form: FormType) => void;
};

export type SuccessFormProps = {
  setSuccess: (isSuccess: boolean) => void;
};
