import { Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import * as _ from "lodash";

import {
  FlattenedQuestionContent,
  FlattenedQuestionSummary,
  NAMESPACES,
} from "shared/api";
import {
  QUESTION_CONTENT,
  QUESTION_QOTD_SUMMARY,
  QUESTION_QOTD_CONTENT,
  QUESTION_SUMMARIES,
  QUESTION_TOPICS,
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
  constructor(private prisma: PrismaService, private cache: RedisCacheService) {
    // Invalidate cache on launch, for demo/test purposes
    (async () => {
      await this.invalidateQuestionCache();
    })();
  }

  /**
   * Gets all the question summaries with the following fields:
   * acRate, difficulty, title, titleSlug, topicTags and updatedAt
   *
   * @return  Array of QuestionSummary with the relevant fields
   */
  async getAllSummaries() {
    const summaries = await this.cache.getKeyInNamespace<
      QuestionSummaryFromDb[]
    >([NAMESPACES.QUESTIONS], QUESTION_SUMMARIES);

    if (!summaries) {
      const res: QuestionSummaryFromDb[] =
        await this.prisma.questionSummary.findMany({
          select: QUESTION_SUMMARY_SELECT,
        });

      this.cache.setKeyInNamespace(
        [NAMESPACES.QUESTIONS],
        QUESTION_SUMMARIES,
        res
      );

      return this.formatQuestionSummaries(res);
    }

    return this.formatQuestionSummaries(summaries);
  }

  async getAllTopics() {
    let topics = await this.cache.getKeyInNamespace<string[]>(
      [NAMESPACES.QUESTIONS],
      QUESTION_TOPICS
    );
    if (!topics) {
      topics = (
        await this.prisma.topicTag.findMany({
          select: { topicSlug: true },
        })
      ).map((v) => v.topicSlug);

      this.cache.setKeyInNamespace(
        [NAMESPACES.QUESTIONS],
        QUESTION_TOPICS,
        topics
      );
    }

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
    const titleKey = QUESTION_CONTENT + titleSlug;

    let content = await this.cache.getKeyInNamespace<FlattenedQuestionContent>(
      [NAMESPACES.QUESTIONS],
      titleKey
    );

    // If content not cached
    if (!content) {
      const res = await this.prisma.questionContent.findUniqueOrThrow({
        where: { titleSlug },
        select: QUESTION_CONTENT_SELECT,
      });
      content = this.formatQuestionContent(res);
      this.cache.setKeyInNamespace([NAMESPACES.QUESTIONS], titleKey, content);
    }
    return content;
  }

  /**
   * @return  The content of the Daily Question
   */
  async getDailyQuestionContent() {
    let dailyQuestionContent =
      await this.cache.getKeyInNamespace<FlattenedQuestionContent>(
        [NAMESPACES.QUESTIONS],
        QUESTION_QOTD_CONTENT
      );

    if (!dailyQuestionContent) {
      const dailySlug = await this.prisma.questionSummary.findFirstOrThrow({
        where: { isDailyQuestion: true },
        select: { titleSlug: true },
      });

      dailyQuestionContent = await this.getContentFromSlug(dailySlug.titleSlug);

      this.cache.setKeyInNamespace(
        [NAMESPACES.QUESTIONS],
        QUESTION_QOTD_CONTENT,
        dailyQuestionContent
      );
    }

    return dailyQuestionContent;
  }

  /**
   * @return  {FlattenedQuestionSummary}  Summary of Daily Question
   */
  async getDailyQuestionSummary(): Promise<FlattenedQuestionSummary> {
    let dailyQuestionSummary =
      await this.cache.getKeyInNamespace<FlattenedQuestionSummary>(
        [NAMESPACES.QUESTIONS],
        QUESTION_QOTD_SUMMARY
      );
    if (!dailyQuestionSummary) {
      // Serverless function ensures that there's only 1 QOTD at a time
      const res: QuestionSummaryFromDb =
        await this.prisma.questionSummary.findFirstOrThrow({
          where: { isDailyQuestion: true },
          select: QUESTION_SUMMARY_SELECT,
        });
      [dailyQuestionSummary] = this.formatQuestionSummaries([res]);
      this.cache.setKeyInNamespace(
        [NAMESPACES.QUESTIONS],
        QUESTION_QOTD_SUMMARY,
        dailyQuestionSummary
      );
    }
    return dailyQuestionSummary;
  }

  async getSummariesFromDifficulty(difficulties: string[]) {
    let allSummaries = await this.cache.getKeyInNamespace<
      QuestionSummaryFromDb[]
    >([NAMESPACES.QUESTIONS], QUESTION_SUMMARIES);

    if (!allSummaries) {
      await this.getAllSummaries(); // Trigger caching
      allSummaries = await this.cache.getKeyInNamespace<
        QuestionSummaryFromDb[]
      >([NAMESPACES.QUESTIONS], QUESTION_SUMMARIES);
    }

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
    const allTitleSlugs = await this.getAllTitleSlugs();
    const validSlugs = _.intersection(allTitleSlugs, titleSlugs);

    let cachedSummaries = await this.cache.getKeyInNamespace<
      QuestionSummaryFromDb[]
    >([NAMESPACES.QUESTIONS], QUESTION_SUMMARIES);

    if (!cachedSummaries) {
      this.getAllSummaries();
      cachedSummaries = await this.cache.getKeyInNamespace<
        QuestionSummaryFromDb[]
      >([NAMESPACES.QUESTIONS], QUESTION_SUMMARIES);
    }

    const validSummaries = cachedSummaries.filter((summary) => {
      return validSlugs.includes(summary.titleSlug);
    });
    return this.formatQuestionSummaries(validSummaries);
  }

  /**
   * Gets a list of summaries that matches the given topics iff all of them are valid
   * and intersect. Else, return an empty array.
   *
   * @param   {string[]}  topicTags  Array of topics to match
   *
   * @return  Array of matching, flattened QuestionSummary
   */
  async getSummariesFromTopicTags(topicTags: string[], matchType: string) {
    const allTopicTags = await this.getAllTopics();
    const validTopicTagArray = _.intersection(allTopicTags, topicTags);
    const cachedSummariesFromTopicTag: QuestionSummaryFromDb[][] = [];

    let cachedSummaries = await this.cache.getKeyInNamespace<
      QuestionSummaryFromDb[]
    >([NAMESPACES.QUESTIONS], QUESTION_SUMMARIES);

    if (!cachedSummaries) {
      await this.getAllSummaries();
      cachedSummaries = await this.cache.getKeyInNamespace<
        QuestionSummaryFromDb[]
      >([NAMESPACES.QUESTIONS], QUESTION_SUMMARIES);
    }

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
   * Helper method to shape QuestionSummaryTableType into a consumer-friendly formay.
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

  private async getAllTitleSlugs() {
    const res = await this.prisma.questionSummary.findMany({
      select: { titleSlug: true },
    });

    return res.map((slug) => slug.titleSlug);
  }

  private filterSummaryByMatchType(
    flatValidSummaries: QuestionSummaryFromDb[][],
    matchType = "AND"
  ): FlattenedQuestionSummary[] {
    if (matchType == "AND") {
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
