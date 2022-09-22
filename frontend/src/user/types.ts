import { User } from "src/login";
import { z } from "zod";

export type ApiResponse = {
  message: string;
};

// schemas
export const ChangePasswordInfoSchema = z
  .object({
    currentPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    newPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
  })
  .superRefine(({ currentPassword, newPassword }, ctx) => {
    if (newPassword === currentPassword) {
      ctx.addIssue({
        code: "custom",
        message: "New password is the same as old password",
      });
    }
  });
export const EditableCredentialsSchema = z.object({
  username: z.string().min(4).max(20),
});

// schema types
export type ChangePasswordInfo = z.infer<typeof ChangePasswordInfoSchema>;
export type EditableCredentials = z.infer<typeof EditableCredentialsSchema>;

// props
export type UserProps = {
  user: User;
};
