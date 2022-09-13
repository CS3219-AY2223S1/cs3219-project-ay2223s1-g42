import { z } from "zod";

export type ApiResponse = {
  message: string;
};

export const UserSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  username: z.string().min(4).max(20),
});
export type User = z.infer<typeof UserSchema>;

export const SignupCredentialsSchema = UserSchema.pick({
  email: true,
  username: true,
}).extend({
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});
export type SignUpCredentials = z.infer<typeof SignupCredentialsSchema>;

export const SigninCredentialsSchema = SignupCredentialsSchema.pick({
  email: true,
  password: true,
});
export type SignInCredentials = z.infer<typeof SigninCredentialsSchema>;

export const EditableCredentialsSchema = UserSchema.pick({
  email: true,
  username: true,
}).partial();
export type EditableCredentials = z.infer<typeof EditableCredentialsSchema>;
