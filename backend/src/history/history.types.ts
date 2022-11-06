import { Prisma } from "@prisma/client";

// * Based on available data

export const USER_HISTORY_SELECT = Prisma.validator<Prisma.UserHistorySelect>()(
  {
    id: true,
    content: true,
    titleSlug: true,
    title: true,
    createdAt: true,
    username: true,
  }
);

export type UserHistoryFromDb = Prisma.UserHistoryGetPayload<{
  select: typeof USER_HISTORY_SELECT;
}>;
