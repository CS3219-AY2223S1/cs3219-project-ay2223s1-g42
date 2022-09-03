import * as z from "nestjs-zod/z";
import { createZodDto } from "nestjs-zod/dto";

export const CredentialsModel = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  username: z.string(),
  password: z.string(),
});

export class CredentialsDto extends createZodDto(CredentialsModel) {}
