import * as z from "zod";

import { initContract } from "@ts-rest/core";

export const UserModel = z.object({
  id: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
  username: z.string().min(4).max(20),
  email: z.string().email({ message: "Invalid email address" }),
  hash: z.string(),
  hashRt: z.string().nullish(),
});

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

const EditableSchema = UserModel.pick({
  email: true,
  username: true,
  hashRt: true,
}).partial();

const ChangePasswordInfoSchema = z.object({
  currentPassword: passwordZodString,
  newPassword: passwordZodString,
});

const a = initContract();

const authContract = a.router({
  signup: {
    method: "POST",
    path: "/local/signup",
    responses: {
      201: a.response<{ message: string }>(),
    },
    body: {},
  },
});
