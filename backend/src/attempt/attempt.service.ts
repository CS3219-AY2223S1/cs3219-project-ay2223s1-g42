import { Injectable } from "@nestjs/common";

import { NAMESPACES, Attempt } from "shared/api";
import { ATTEMPT_SELECT } from "./attempt.types";
import { RedisCacheService } from "../cache/redisCache.service";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AttemptService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisCacheService
  ) {}

  /**
   * Returns all attempts of a user given their username, and optionally
   * the titleSlug of a specific question.
   *
   * @param   {number}  userId    The user's id
   * @param   {string}  titleSlug   The title slug of a question
   *
   * @return  {Attempt[]} All attempts from user. Empty if no attempts.
   */
  async getAttempts(
    userId: number,
    titleSlug?: string
  ): Promise<Attempt[] | Attempt> {
    if (titleSlug) {
      return this.getQuestionAttempts(userId, titleSlug);
    }
    return this.getAllUserAttempts(userId);
  }

  /**
   * Returns all attempts of a user on PeerPrep from the cache.
   * If cache is empty, it queries the main database before saving in the cache.
   *
   * @param   {number}   userId   The user's id
   *
   * @return  {Attempt[]} All attempts from user. Empty if no attempts.
   */
  private async getAllUserAttempts(userId: number): Promise<Attempt[]> {
    const userAttempts = await this.getUserAttemptsFromCache(userId);
    return userAttempts;
  }

  /**
   * Returns all attempts of the user on a specific question.
   *
   * @param   {number}   userId   The user's id
   * @param   {string}  titleSlug   The title slug of a question
   *
   * @return  {Attempt[]} All attempts from a specific question by a user.
   */
  private async getQuestionAttempts(
    userId: number,
    titleSlug: string
  ): Promise<Attempt[]> {
    const userAttempts = await this.getAllUserAttempts(userId);
    const filteredAttempts = userAttempts.filter(
      (v) => v.titleSlug === titleSlug
    );
    return filteredAttempts;
  }

  /**
   * Adds an attempt to the user.
   *
   * @param   {number}  userId   The user's id
   * @param   {number}  roomId   The room's id
   * @param   {string}  title  Title of the attempted question
   * @param   {string}  titleSlug  Title slug of the attempted question
   * @param   {string}  content    Content of the editor
   */
  async upsertAttempt(
    userId: number,
    roomId: string,
    title: string,
    titleSlug: string,
    content: string
  ) {
    this.prisma.attempt
      .upsert({
        where: { titleSlug_userId_roomId: { titleSlug, userId, roomId } },
        update: { content },
        create: { userId, roomId, title, titleSlug, content },
      })
      .then(async () => {
        // revalidate cache after each creation
        await this.invalidateSpecificAttemptCache(userId);
        await this.getAttempts(userId);
      });
  }

  // ***** Caching helpers *****
  private async getUserAttemptsFromCache(userId: number): Promise<Attempt[]> {
    const cachedAttempts = await this.redis.getKeyInNamespace<Attempt[]>(
      [NAMESPACES.ATTEMPT],
      userId.toString()
    );
    if (cachedAttempts) {
      return cachedAttempts;
    }

    const prismaAttempts = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { attempts: { select: ATTEMPT_SELECT } },
    });
    await this.redis.setKeyInNamespace(
      [NAMESPACES.ATTEMPT],
      userId.toString(),
      prismaAttempts.attempts
    );
    return prismaAttempts.attempts;
  }

  async invalidateAllAttemptsCache() {
    const attemptCacheKeys = await this.redis.getAllKeysInNamespace([
      NAMESPACES.ATTEMPT,
    ]);
    for (const key of attemptCacheKeys) {
      await this.redis.deleteKeyInNamespace([NAMESPACES.ATTEMPT], key);
    }
  }

  async invalidateSpecificAttemptCache(userId: number) {
    await this.redis.deleteKeyInNamespace(
      [NAMESPACES.ATTEMPT],
      userId.toString()
    );
  }
}
