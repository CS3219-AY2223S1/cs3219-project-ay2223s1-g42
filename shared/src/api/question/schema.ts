import { z } from "zod";

import { QuestionDifficulty, TopicMatchType } from "./types";

const SummaryQuerySchema = z.object({
  titleSlugs: z.string().or(z.array(z.string())).optional(),
  topicTags: z.string().or(z.array(z.string())).optional(),
});

export const QuestionQuerySchema = z.object({
  difficulty: z
    .string()
    .refine((v) =>
      v.split(",").every((v) => ["easy", "medium", "hard"].includes(v))
    )
    .transform((v) =>
      Array.from(new Set(v.split(",").map((v) => v.toLowerCase())))
    )
    .or(z.array(z.nativeEnum(QuestionDifficulty)))
    .optional(),
  titleSlugs: z
    .string()
    .transform((v) =>
      Array.from(
        new Set(
          v
            .split(",")
            .map((v) => v.trim().toLowerCase())
            .filter((v) => v.length > 0)
        )
      )
    )
    .or(z.array(z.string()))
    .optional(),
  topicTags: z
    .string()
    .transform((v) =>
      Array.from(
        new Set(
          v
            .split(",")
            .map((v) => v.trim().toLowerCase())
            .filter((v) => v.length > 0)
        )
      )
    )
    .or(z.array(z.string()))
    .optional(),
  topicMatch: z
    .string()
    .transform((v) => v.toUpperCase())
    .or(z.nativeEnum(TopicMatchType))
    .default(TopicMatchType.OR)
    .optional(),
});
