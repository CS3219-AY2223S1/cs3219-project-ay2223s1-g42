import { z } from "zod";

const SummaryQuerySchema = z.object({
  titleSlugs: z.string().or(z.array(z.string())).optional(),
  topicTags: z.string().or(z.array(z.string())).optional(),
});
