import { Injectable } from "@nestjs/common";

import { NAMESPACES } from "shared/api";

import { USER_HISTORY_SELECT, UserHistoryFromDb } from "./history.types";
import { RedisCacheService } from "../cache/redisCache.service";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class HistoryService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisCacheService
  ) {}

  /**
   * Returns a user's attempt history given their username, and optionally
   * the titleSlug of a specific question.
   *
   * @param   {string}  username    The user's username
   * @param   {string}  titleSlug   The title slug of a question
   *
   * @return  {UserHistoryFromDb[]} History of attempts from user. Empty if no history.
   */
  async getHistory(
    username: string,
    titleSlug?: string
  ): Promise<UserHistoryFromDb[] | UserHistoryFromDb> {
    if (titleSlug) {
      return this.getQuestionHistory(username, titleSlug);
    }
    return this.getUserFullHistory(username);
  }

  /**
   * Returns the entire history of a user's attempt on PeerPrep from the cache.
   * If cache is empty, it queries the main database before saving in the cache.
   *
   * @param   {string}   username   The user's username
   *
   * @return  {UserHistoryFromDb[]} History of attempts from user. Empty if no history.
   */
  private async getUserFullHistory(
    username: string
  ): Promise<UserHistoryFromDb[]> {
    const userHistory = await this.getUserFullHistoryFromCache(username);
    return userHistory;
  }

  /**
   * Returns the user's attempt on a specific question.
   *
   * @param   {string}  username    The user's username
   * @param   {string}  titleSlug   The title slug of a question
   *
   * @return  {UserHistoryFromDb[]} History of attempts from a specific question by a user.
   */
  private async getQuestionHistory(
    username: string,
    titleSlug: string
  ): Promise<UserHistoryFromDb[]> {
    const userHistory = await this.getUserFullHistory(username);
    const filteredHistory = userHistory.filter(
      (v) => v.titleSlug === titleSlug
    );

    return filteredHistory;
  }

  /**
   * Adds an attempt to the user's history
   *
   * @param   {string}  username   User's username
   * @param   {string}  titleSlug  Title slug of the attempted question
   * @param   {string}  content    Content of the editor
   */
  async addHistory(
    username: string,
    title: string,
    titleSlug: string,
    content: string
  ) {
    this.prisma.userHistory
      .create({ data: { content, title, titleSlug, username } })
      .then(async () => {
        // revalidate cache after each creation
        await this.invalidateSpecificHistoryCache(username);
        await this.getHistory(username);
      });
  }

  // ***** Caching helpers *****
  private async getUserFullHistoryFromCache(
    username: string
  ): Promise<UserHistoryFromDb[]> {
    const cachedUserHistory = await this.redis.getKeyInNamespace<
      UserHistoryFromDb[]
    >([NAMESPACES.HISTORY], username);

    if (!cachedUserHistory) {
      const prismaUserHistory = await this.prisma.user.findUniqueOrThrow({
        where: { username },
        select: { history: { select: USER_HISTORY_SELECT } },
      });

      await this.redis.setKeyInNamespace(
        [NAMESPACES.HISTORY],
        username,
        prismaUserHistory.history
      );

      return prismaUserHistory.history;
    }
    return cachedUserHistory;
  }

  async invalidateAllHistoryCache() {
    const historyCacheKeys = await this.redis.getAllKeysInNamespace([
      NAMESPACES.HISTORY,
    ]);
    for (const key of historyCacheKeys) {
      await this.redis.deleteKeyInNamespace([NAMESPACES.HISTORY], key);
    }
  }

  async invalidateSpecificHistoryCache(username: string) {
    await this.redis.deleteKeyInNamespace([NAMESPACES.HISTORY], username);
  }
}
