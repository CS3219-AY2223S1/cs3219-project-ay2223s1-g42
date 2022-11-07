import { Prisma } from "@prisma/client";

// * Based on available data

export const ATTEMPT_SELECT = Prisma.validator<Prisma.AttemptSelect>()({
  content: true,
  titleSlug: true,
  title: true,
  createdAt: true,
  updatedAt: true,
  userId: true,
  roomId: true,
});

export type AttemptFromDb = Prisma.AttemptGetPayload<{
  select: typeof ATTEMPT_SELECT;
}>;
