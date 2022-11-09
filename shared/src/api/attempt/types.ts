import { z } from "zod";

import { AttemptModel } from "../../models";

type Attempt = Pick<
  z.infer<typeof AttemptModel>,
  | "titleSlug"
  | "content"
  | "createdAt"
  | "updatedAt"
  | "userId"
  | "roomId"
  | "title"
>;

type GetAttemptsResponse = Attempt[];

export type { Attempt, GetAttemptsResponse };
