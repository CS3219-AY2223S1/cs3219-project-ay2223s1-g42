import { Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import * as _ from "lodash";

import {
  FlattenedQuestionContent,
  FlattenedQuestionSummary,
  NAMESPACES,
  TopicMatchType,
} from "shared/api";
import {
  QUESTION_CONTENT,
  QUESTION_QOTD_SUMMARY,
  QUESTION_QOTD_CONTENT,
  QUESTION_SUMMARIES,
  QUESTION_TOPICS,
  QUESTION_QOTD_SLUG,
  QUESTION_TITLES,
} from "./question.cache.keys";
import {
  QuestionContentFromDb,
  QuestionSummaryFromDb,
  QUESTION_CONTENT_SELECT,
  QUESTION_SUMMARY_SELECT,
} from "./question.type";
import { PrismaService } from "../prisma/prisma.service";
import { RedisCacheService } from "../cache/redisCache.service";

@Injectable()
export class QuestionService {
  constructor(
    private prisma: PrismaService,
    private cache: RedisCacheService
  ) {}

  /**
   * Gets all the question summaries with the following fields:
   * acRate, difficulty, title, titleSlug, topicTags and updatedAt
   *
   * @return  Array of QuestionSummary with the relevant fields
   */
  async getAllSummaries() {
    const summaries = await this.getAllSummariesFromCache();
    return this.formatQuestionSummaries(summaries);
  }

  async getAllTopics() {
    const topics = await this.getAllTopicsFromCache();

    return topics;
  }

  /**
   * Gets a summary that matches the unique title slug
   *
   * @param   {string} titleSlug  title slug associated to the question
   *
   * @return  Corresponding QuestionSummary to the title slug
   * @throws  NotFoundError
   */
  async getContentFromSlug(
    titleSlug: string
  ): Promise<FlattenedQuestionContent> {
    const content = await this.getContentFromCache(titleSlug);
    return this.formatQuestionContent(content);
  }

  /**
   * @return  The content of the Daily Question
   */
  async getDailyQuestionContent(): Promise<FlattenedQuestionContent> {
    const dailyQuestionContent = await this.getDailyQuestionContentFromCache();
    return this.formatQuestionContent(dailyQuestionContent);
  }

  /**
   * @return  {FlattenedQuestionSummary}  Summary of Daily Question
   */
  async getDailyQuestionSummary(): Promise<FlattenedQuestionSummary> {
    const dailySummary = await this.getDailyQuestionSummaryFromCache();
    const [flattendSummary] = this.formatQuestionSummaries([dailySummary]);
    return flattendSummary;
  }

  async getSummariesFromDifficulty(difficulties: string[]) {
    const allSummaries = await this.getAllSummariesFromCache();
    const matchedQuestions = allSummaries.filter((summary) =>
      difficulties.includes(summary.difficulty.toLowerCase())
    );
    return this.formatQuestionSummaries(matchedQuestions);
  }

  /**
   * Gets a summary that matches the unique title slug
   *
   * @param   {string} titleSlugs  title slugs associated to the questions
   *
   * @return  Corresponding QuestionSummary to the title slug
   * @throws  NotFoundError
   */
  async getSummariesFromSlug(titleSlugs: string[]) {
    const allTitleSlugs = await this.getAllTitleSlugsFromCache();
    const validSlugs: string[] = _.intersection(allTitleSlugs, titleSlugs);

    const cachedSummaries = await this.getAllSummariesFromCache();
    const validSummaries = cachedSummaries.filter((summary) => {
      return validSlugs.includes(summary.titleSlug);
    });
    return this.formatQuestionSummaries(validSummaries);
  }

  /**
   * Gets a list of summaries that matches the given the valid topics.
   * Returns questions with the intersecting topics (AND) by default.
   * If `matchType = "OR"`, it returns all questions that match the topics provided.
   *
   * @param   {string[]}  topicTags  Array of topics to match
   * @param   {string}    matchType  Determines intersect (AND) or unique union set (OR)
   *
   * @return  {Promise<FlattenedQuestionSummary[]>} Array of question summaries in a readable format
   */
  async getSummariesFromTopicTags(
    topicTags: string[],
    matchType: TopicMatchType = TopicMatchType.OR
  ): Promise<FlattenedQuestionSummary[]> {
    const allTopicTags = await this.getAllTopics();
    const validTopicTagArray = _.intersection(allTopicTags, topicTags);

    const cachedSummaries = await this.getAllSummariesFromCache();
    const cachedSummariesFromTopicTag: QuestionSummaryFromDb[][] = [];
    for (const tag of validTopicTagArray) {
      const currentMatchedQuestions = cachedSummaries.filter((summary) => {
        const currentQuestionTags = summary.topicTags.map(
          (topic) => topic.topicSlug
        );
        return currentQuestionTags.includes(tag);
      });
      cachedSummariesFromTopicTag.push(currentMatchedQuestions);
    }
    const res: FlattenedQuestionSummary[] = this.filterSummaryByMatchType(
      cachedSummariesFromTopicTag,
      matchType
    );
    return res;
  }

  // ***** HELPER FUNCTIONS ***** //

  /**
   * Helper method to shape QuestionContentFromDb into a readable format.
   *
   * @return  {[type]}  [return description]
   */
  private formatQuestionContent(
    data: QuestionContentFromDb
  ): FlattenedQuestionContent {
    const { content, titleSlug, ...info } = data;
    const normContent: FlattenedQuestionContent = {
      content,
      discussionLink: this.getDiscussionLink(titleSlug),
      hints: info.hints.map((v) => v.hint),
      topicTags: info.summary.topicTags.map((v) => v.topicSlug),
    };

    return normContent;
  }

  /**
   * Helper method to shape QuestionSummaryFromDb into a readable format.
   *
   * @param   {QuestionSummaryFromDb[]}  data Raw data formatted by Prisma
   *
   * @return  {FlattenedQuestionSummary[]}  "Flattened" QuestionSummaryTableType
   */
  private formatQuestionSummaries(
    data: QuestionSummaryFromDb[]
  ): FlattenedQuestionSummary[] {
    const normData = data.map((summary) => {
      const { topicTags, updatedAt, titleSlug, ...info } = summary;
      return {
        ...info,
        discussionLink: this.getDiscussionLink(titleSlug),
        topicTags: topicTags.map((tag) => tag.topicSlug),
        titleSlug,
        updatedAt,
      };
    });

    return normData;
  }

  private getDiscussionLink(titleSlug: string) {
    return (
      `https://leetcode.com/problems/${titleSlug}` +
      `/discuss/?currentPage=1&orderBy=most_votes&query=`
    );
  }

  /**
   * Returns the intersection (AND) or unique set of all questions (OR) if
   * multiple valid topicTags are provided.
   *
   * @return  {FlattenedQuestionSummary[]}  Formatted question summaries.
   */
  private filterSummaryByMatchType(
    flatValidSummaries: QuestionSummaryFromDb[][],
    matchType: TopicMatchType = TopicMatchType.OR
  ): FlattenedQuestionSummary[] {
    if (matchType === TopicMatchType.AND) {
      const andMatched = _.intersectionBy(
        ...flatValidSummaries,
        (summary) => summary.titleSlug
      );

      return this.formatQuestionSummaries(andMatched);
    } else {
      const orMatched = _.uniqBy(
        flatValidSummaries.flat(),
        (summary) => summary.titleSlug
      );

      return this.formatQuestionSummaries(orMatched);
    }
  }

  // ***** CACHING FUNCTIONS ***** //

  async getContentFromCache(titleSlug: string): Promise<QuestionContentFromDb> {
    const key = QUESTION_CONTENT + titleSlug;
    const cachedContent =
      await this.cache.getKeyInNamespace<QuestionContentFromDb>(
        [NAMESPACES.QUESTIONS],
        key
      );

    if (!cachedContent) {
      const prismaContent = await this.prisma.questionContent.findUniqueOrThrow(
        {
          where: { titleSlug },
          select: QUESTION_CONTENT_SELECT,
        }
      );

      await this.cache.setKeyInNamespace(
        [NAMESPACES.QUESTIONS],
        key,
        prismaContent
      );
      return prismaContent;
    }

    return cachedContent;
  }

  async getAllSummariesFromCache(): Promise<QuestionSummaryFromDb[]> {
    const cachedSummaries = await this.cache.getKeyInNamespace<
      QuestionSummaryFromDb[]
    >([NAMESPACES.QUESTIONS], QUESTION_SUMMARIES);

    if (!cachedSummaries) {
      const allPrismaSummaries: QuestionSummaryFromDb[] =
        await this.prisma.questionSummary.findMany({
          select: QUESTION_SUMMARY_SELECT,
        });

      await this.cache.setKeyInNamespace<QuestionSummaryFromDb[]>(
        [NAMESPACES.QUESTIONS],
        QUESTION_SUMMARIES,
        allPrismaSummaries
      );
      return allPrismaSummaries;
    }

    return cachedSummaries;
  }

  async getAllTopicsFromCache(): Promise<string[]> {
    const cachedTopics = await this.cache.getKeyInNamespace<string[]>(
      [NAMESPACES.QUESTIONS],
      QUESTION_TOPICS
    );

    if (!cachedTopics) {
      const res = await this.prisma.topicTag.findMany({
        select: { topicSlug: true },
      });

      const flattenedTopics = res.map((v) => v.topicSlug);

      await this.cache.setKeyInNamespace(
        [NAMESPACES.QUESTIONS],
        QUESTION_TOPICS,
        flattenedTopics
      );

      return flattenedTopics;
    }

    return cachedTopics;
  }

  async getAllTitleSlugsFromCache(): Promise<string[]> {
    const cachedSlugs = await this.cache.getKeyInNamespace<string[]>(
      [NAMESPACES.QUESTIONS],
      QUESTION_TITLES
    );

    if (!cachedSlugs) {
      const prismaSlugs = await this.prisma.questionSummary.findMany({
        select: { titleSlug: true },
      });
      const flattenedSlugs = prismaSlugs.map((v) => v.titleSlug);
      await this.cache.setKeyInNamespace<string[]>(
        [NAMESPACES.QUESTIONS],
        QUESTION_TITLES,
        flattenedSlugs
      );

      return flattenedSlugs;
    }

    return cachedSlugs;
  }

  async getDailyQuestionContentFromCache(): Promise<QuestionContentFromDb> {
    const cachedContent =
      await this.cache.getKeyInNamespace<QuestionContentFromDb>(
        [NAMESPACES.QUESTIONS],
        QUESTION_QOTD_CONTENT
      );

    if (!cachedContent) {
      const dailySlug = await this.getDailySlugFromCache();
      const content = await this.getContentFromCache(dailySlug);
      await this.cache.setKeyInNamespace<QuestionContentFromDb>(
        [NAMESPACES.QUESTIONS],
        QUESTION_QOTD_CONTENT,
        content
      );
      return content;
    }

    return cachedContent;
  }

  async getDailyQuestionSummaryFromCache(): Promise<QuestionSummaryFromDb> {
    const dailySummary =
      await this.cache.getKeyInNamespace<QuestionSummaryFromDb>(
        [NAMESPACES.QUESTIONS],
        QUESTION_QOTD_SUMMARY
      );

    if (!dailySummary) {
      const dailySlug = await this.getDailySlugFromCache();
      const allSummaries = await this.getAllSummariesFromCache();

      // For-loop used for early termination
      for (const summary of allSummaries) {
        if (summary.titleSlug != dailySlug) {
          continue;
        }

        await this.cache.setKeyInNamespace<QuestionSummaryFromDb>(
          [NAMESPACES.QUESTIONS],
          QUESTION_QOTD_SUMMARY,
          summary
        );
        return summary;
      }
    }

    return dailySummary;
  }

  async getDailySlugFromCache(): Promise<string> {
    const cachedDailySlug = await this.cache.getKeyInNamespace<string>(
      [NAMESPACES.QUESTIONS],
      QUESTION_QOTD_SLUG
    );

    if (!cachedDailySlug) {
      const prismaDailySlug =
        await this.prisma.questionSummary.findFirstOrThrow({
          where: { isDailyQuestion: true },
          select: { titleSlug: true },
        });

      await this.cache.setKeyInNamespace(
        [NAMESPACES.QUESTIONS],
        QUESTION_QOTD_SLUG,
        prismaDailySlug.titleSlug
      );

      return prismaDailySlug.titleSlug;
    }

    return cachedDailySlug;
  }

  //Cron jobs to invalidate the cache
  @Cron("0 15 * * * *")
  async invalidateQuestionCache() {
    const questionCacheKeys = await this.cache.getAllKeysInNamespace([
      NAMESPACES.QUESTIONS,
    ]);
    for (const key of questionCacheKeys) {
      await this.cache.deleteKeyInNamespace([NAMESPACES.QUESTIONS], key);
    }
  }
}
