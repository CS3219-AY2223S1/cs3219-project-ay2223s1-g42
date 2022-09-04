import * as z from "nestjs-zod/z";
import { createZodDto } from "nestjs-zod/dto";

export const SignupCredentials = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  username: z.string(),
  password: z.string(),
});

export const SigninCredentials = SignupCredentials.pick({
  email: true,
  password: true,
});

export class SignupCredentialsDto extends createZodDto(SignupCredentials) {}
export class SigninCredentialsDto extends createZodDto(SigninCredentials) {}
