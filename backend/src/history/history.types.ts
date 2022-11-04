import { Prisma } from "@prisma/client";

// * Based on available data

export const USER_HISTORY_SELECT = Prisma.validator<Prisma.UserHistorySelect>()(
  {
    content: true,
    roomId: true,
    titleSlug: true,
    updatedAt: true,
    username: true,
  }
);

export type UserHistoryFromDb = Prisma.UserHistoryGetPayload<{
  select: typeof USER_HISTORY_SELECT;
}>;
