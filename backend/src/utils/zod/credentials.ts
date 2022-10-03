import * as z from "nestjs-zod/z";
import { createZodDto } from "nestjs-zod/dto";

import { UserModel } from "src/zod";

const passwordZodString = z
  .string()
  .min(8, { message: "Password must be at least 8 characters" });

export const SignupSchema = UserModel.pick({
  email: true,
  username: true,
}).extend({
  password: passwordZodString,
});

export const SigninSchema = SignupSchema.pick({
  email: true,
  password: true,
});

export const ForgetPasswordSchema = UserModel.pick({
  email: true,
});

const ResetPasswordSchema = SignupSchema.pick({
  password: true,
}).extend({ token: z.string() });

export const EditableSchema = UserModel.pick({
  email: true,
  username: true,
  hashRt: true,
}).partial();

export const ChangePasswordInfoSchema = z.object({
  currentPassword: passwordZodString,
  newPassword: passwordZodString,
});

export const QuestionQuerySchema = z.object({
  difficulty: z.enum(["Easy", "Medium", "Hard"]).array().optional(),
  titleSlugs: z.string().array().optional(),
  topicTags: z
    .enum([
      "array",
      "backtracking",
      "biconnected-component",
      "binary-indexed-tree",
      "binary-search",
      "binary-search-tree",
      "binary-tree",
      "bit-manipulation",
      "bitmask",
      "brainteaser",
      "breadth-first-search",
      "bucket-sort",
      "combinatorics",
      "concurrency",
      "counting",
      "counting-sort",
      "data-stream",
      "database",
      "depth-first-search",
      "design",
      "divide-and-conquer",
      "doubly-linked-list",
      "dynamic-programming",
      "enumeration",
      "eulerian-circuit",
      "game-theory",
      "geometry",
      "graph",
      "greedy",
      "hash-function",
      "hash-table",
      "heap-priority-queue",
      "interactive",
      "iterator",
      "line-sweep",
      "linked-list",
      "math",
      "matrix",
      "memoization",
      "merge-sort",
      "minimum-spanning-tree",
      "monotonic-queue",
      "monotonic-stack",
      "number-theory",
      "ordered-set",
      "prefix-sum",
      "probability-and-statistics",
      "queue",
      "quickselect",
      "radix-sort",
      "randomized",
      "recursion",
      "rejection-sampling",
      "reservoir-sampling",
      "rolling-hash",
      "segment-tree",
      "shell",
      "shortest-path",
      "simulation",
      "sliding-window",
      "sorting",
      "stack",
      "string",
      "string-matching",
      "strongly-connected-component",
      "suffix-array",
      "topological-sort",
      "tree",
      "trie",
      "two-pointers",
      "union-find",
    ])
    .array()
    .optional(),
});

export const DeleteAccountInfoSchema = SignupSchema.pick({ password: true });

export class SignupCredentialsDto extends createZodDto(SignupSchema) {}
export class SigninCredentialsDto extends createZodDto(SigninSchema) {}
export class EditableCredentialsDto extends createZodDto(EditableSchema) {}
export class ForgetPasswordCredentialsDto extends createZodDto(
  ForgetPasswordSchema
) {}
export class ResetPasswordCredentialsDto extends createZodDto(
  ResetPasswordSchema
) {}
export class ChangePasswordInfoDto extends createZodDto(
  ChangePasswordInfoSchema
) {}
export class DeleteAccountInfoDto extends createZodDto(
  DeleteAccountInfoSchema
) {}

export class QuestionQueriesDto extends createZodDto(QuestionQuerySchema) {}
