import { Injectable } from "@nestjs/common";
import * as _ from "lodash";

import { FlattenedQuestionContent, FlattenedQuestionSummary } from "shared/api";
import {
  QuestionContentFromDb,
  QuestionSummaryFromDb,
  QUESTION_CONTENT_SELECT,
  QUESTION_SUMMARY_SELECT,
} from "./question.type";
import { PrismaService } from "../prisma/prisma.service";
import { NAMESPACES } from "shared/api";
import { RedisCacheService } from "src/cache/redisCache.service";
import {
  QUESTION_CONTENT,
  QUESTION_QOTD_SUMMARY,
  QUESTION_QOTD_CONTENT,
  QUESTION_SUMMARIES,
  QUESTION_TOPICS,
  QUESTION_SUMMARY_DIFFICULTIES,
  QUESTION_SUMMARIES_FORMATTED,
} from "./question.cache.keys";
import { Cron } from "@nestjs/schedule";

@Injectable()
export class QuestionService {
  constructor(
    private prisma: PrismaService,
    private cache: RedisCacheService
  ) {}

  recentlyCached: string[] = [];
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
    const topics = await this.cache.getKeyInNamespace<{ topicSlug: string }[]>(
      [NAMESPACES.QUESTIONS],
      QUESTION_TOPICS
    );
    if (!topics) {
      const res = await this.prisma.topicTag.findMany({
        select: { topicSlug: true },
      });

      this.cache.setKeyInNamespace(
        [NAMESPACES.QUESTIONS],
        QUESTION_TOPICS,
        res
      );
      return res.map((slug) => slug.topicSlug);
    }

    return topics.map((slug) => slug.topicSlug);
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
    //If content isnt cached in memory yet
    const titleKey = QUESTION_CONTENT + titleSlug;

    const content =
      await this.cache.getKeyInNamespace<FlattenedQuestionContent>(
        [NAMESPACES.QUESTIONS],
        titleKey
      );

    if (!content) {
      const res = await this.prisma.questionContent.findUniqueOrThrow({
        where: { titleSlug },
        select: QUESTION_CONTENT_SELECT,
      });
      const formattedQuestionContent = this.formatQuestionContent(res);
      this.cache.setKeyInNamespace([NAMESPACES.QUESTIONS], titleKey, res);
      this.recentlyCached.push(titleKey);

      return formattedQuestionContent;
    }
    return content;
  }

  /**
   * @return  The content of the Daily Question
   */
  async getDailyQuestionContent() {
    const dailyQuestionContent =
      await this.cache.getKeyInNamespace<FlattenedQuestionContent>(
        [NAMESPACES.QUESTIONS],
        QUESTION_QOTD_CONTENT
      );

    if (!dailyQuestionContent) {
      const dailySlug = await this.prisma.questionSummary.findFirstOrThrow({
        where: { isDailyQuestion: true },
        select: { titleSlug: true },
      });

      const contentRetrivedFromSlug = await this.getContentFromSlug(
        dailySlug.titleSlug
      );
      this.cache.setKeyInNamespace(
        [NAMESPACES.QUESTIONS],
        QUESTION_QOTD_CONTENT,
        contentRetrivedFromSlug
      );
    }

    return dailyQuestionContent;
  }

  /**
   * @return  {FlattenedQuestionSummary}  Summary of Daily Question
   */
  async getDailyQuestionSummary(): Promise<FlattenedQuestionSummary> {
    const dailyQuestionSummary =
      await this.cache.getKeyInNamespace<FlattenedQuestionSummary>(
        [NAMESPACES.QUESTIONS],
        QUESTION_QOTD_SUMMARY
      );
    if (!dailyQuestionSummary) {
      // Serverless function ensures that there's only 1 QOTD at a time
      const dailySummary: QuestionSummaryFromDb =
        await this.prisma.questionSummary.findFirstOrThrow({
          where: { isDailyQuestion: true },
          select: QUESTION_SUMMARY_SELECT,
        });
      const [formattedSummary] = this.formatQuestionSummaries([dailySummary]);
      this.cache.setKeyInNamespace(
        [NAMESPACES.QUESTIONS],
        QUESTION_QOTD_SUMMARY,
        formattedSummary
      );
      return formattedSummary;
    }
    return dailyQuestionSummary;
  }

  async getSummariesFromDifficulty(difficulties: string[]) {
    const summariesFromDifficulty = await this.cache.getKeyInNamespace<
      FlattenedQuestionSummary[]
    >([NAMESPACES.QUESTIONS], QUESTION_SUMMARY_DIFFICULTIES);

    if (!summariesFromDifficulty) {
      const validDifficulties: QuestionSummaryFromDb[] =
        await this.prisma.questionSummary.findMany({
          where: { difficulty: { in: difficulties } },
          select: QUESTION_SUMMARY_SELECT,
        });

      this.cache.setKeyInNamespace(
        [NAMESPACES.QUESTIONS],
        QUESTION_SUMMARY_DIFFICULTIES,
        this.formatQuestionSummaries(validDifficulties)
      );

      return this.formatQuestionSummaries(validDifficulties);
    }

    return summariesFromDifficulty;
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
      this.getAllSummaries();
      cachedSummaries = await this.cache.getKeyInNamespace<
        QuestionSummaryFromDb[]
      >([NAMESPACES.QUESTIONS], QUESTION_SUMMARIES);
    }

    for (const tag in validTopicTagArray) {
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
    matchType = "OR"
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
  invalidateQuestionCache() {
    //Delete the question summaries
    this.cache.deleteKeyInNamespace([NAMESPACES.QUESTIONS], QUESTION_SUMMARIES);
    //Delete the question content
    this.cache.deleteKeyInNamespace([NAMESPACES.QUESTIONS], QUESTION_CONTENT);
    //Delete the question topics
    this.cache.deleteKeyInNamespace([NAMESPACES.QUESTIONS], QUESTION_TOPICS);

    //Delete the question of the day's content and summary
    this.cache.deleteKeyInNamespace(
      [NAMESPACES.QUESTIONS],
      QUESTION_QOTD_CONTENT
    );
    this.cache.deleteKeyInNamespace(
      [NAMESPACES.QUESTIONS],
      QUESTION_QOTD_SUMMARY
    );

    //Delete the question summaries categorized into difficulties
    this.cache.deleteKeyInNamespace(
      [NAMESPACES.QUESTIONS],
      QUESTION_SUMMARY_DIFFICULTIES
    );

    //Delete individual question summaries that has been cached
    for (const key in this.recentlyCached) {
      this.cache.deleteKeyInNamespace([NAMESPACES.QUESTIONS], key);
    }
  }
}
