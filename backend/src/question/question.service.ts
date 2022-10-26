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
  question_contents,
  question_qotd_summary,
  question_qotd_content,
  question_summaries,
  question_topics,
  question_summary_difficulties,
  question_summaries_formatted,
} from "./question.cache.keys";
import { title } from "process";
import { QuestionHint, QuestionSummary, TopicTag } from "@prisma/client";

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
    const summaries = await this.cache.getKeyInNamespace<
      FlattenedQuestionSummary[]
    >([NAMESPACES.QUESTIONS], question_summaries_formatted);

    if (!summaries) {
      const res: QuestionSummaryFromDb[] =
        await this.prisma.questionSummary.findMany({
          select: QUESTION_SUMMARY_SELECT,
        });

      const questionSummaries = await this.prisma.topicTag.findMany({
        select: {
          questionSummaries: {
            select: QUESTION_SUMMARY_SELECT,
          },
        },
      });

      const formattedQuestionSummaries = this.formatQuestionSummaries(res);

      this.cache.setKeyInNamespace(
        [NAMESPACES.QUESTIONS],
        question_summaries,
        res
      );

      this.cache.setKeyInNamespace(
        [NAMESPACES.QUESTIONS],
        question_summaries_formatted,
        formattedQuestionSummaries
      );
      return formattedQuestionSummaries;
    }

    return summaries;
  }

  async getAllTopics() {
    const topics = await this.cache.getKeyInNamespace<{ topicSlug: string }[]>(
      [NAMESPACES.QUESTIONS],
      question_topics
    );
    if (!topics) {
      const res = await this.prisma.topicTag.findMany({
        select: { topicSlug: true },
      });

      this.cache.setKeyInNamespace(
        [NAMESPACES.QUESTIONS],
        question_topics,
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
    const titleKey = question_contents + titleSlug;

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

      return formattedQuestionContent;
    }
    return content;
  }

  /**
   * @return  The content of the Daily Question
   */
  async getDailyQuestionContent() {
    let today = new Date().toISOString().slice(0, 10);
    const dailyQuestionKey = question_qotd_content + today;
    const dailyQuestionContent =
      await this.cache.getKeyInNamespace<FlattenedQuestionContent>(
        [NAMESPACES.QUESTIONS],
        dailyQuestionKey
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
        dailyQuestionKey,
        contentRetrivedFromSlug
      );
    }

    return dailyQuestionContent;
  }

  /**
   * @return  {FlattenedQuestionSummary}  Summary of Daily Question
   */
  async getDailyQuestionSummary(): Promise<FlattenedQuestionSummary> {
    let today = new Date().toISOString().slice(0, 10);
    const dailyQuestionKey = question_qotd_summary + today;
    const dailyQuestionSummary =
      await this.cache.getKeyInNamespace<FlattenedQuestionSummary>(
        [NAMESPACES.QUESTIONS],
        dailyQuestionKey
      );
    if (!dailyQuestionSummary) {
      // Cron job ensures that there's only 1 QOTD at a time
      const dailySummary: QuestionSummaryFromDb =
        await this.prisma.questionSummary.findFirstOrThrow({
          where: { isDailyQuestion: true },
          select: QUESTION_SUMMARY_SELECT,
        });
      const [formattedSummary] = this.formatQuestionSummaries([dailySummary]);
      this.cache.setKeyInNamespace(
        [NAMESPACES.QUESTIONS],
        dailyQuestionKey,
        formattedSummary
      );
      return formattedSummary;
    }
    return dailyQuestionSummary;
  }

  async getSummariesFromDifficulty(difficulties: string[]) {
    const summariesKey = question_summary_difficulties;
    const summariesFromDifficulty = this.cache.getKeyInNamespace<
      FlattenedQuestionSummary[]
    >([NAMESPACES.QUESTIONS], summariesKey);

    if (!summariesFromDifficulty) {
      const validDifficulties: QuestionSummaryFromDb[] =
        await this.prisma.questionSummary.findMany({
          where: { difficulty: { in: difficulties } },
          select: QUESTION_SUMMARY_SELECT,
        });

      this.cache.setKeyInNamespace(
        [NAMESPACES.QUESTIONS],
        summariesKey,
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

    let cachedSummaries = this.cache.getKeyInNamespace<
      FlattenedQuestionSummary[]
    >([NAMESPACES.QUESTIONS], question_summaries);

    if (!cachedSummaries) {
      cachedSummaries = this.getAllSummaries();
    }

    const validSummaries = (await cachedSummaries).filter((summary) => {
      summary.titleSlug in validSlugs;
    });
    /*
    const validSummaries: QuestionSummaryFromDb[] =
      await this.prisma.questionSummary.findMany({
        where: { titleSlug: { in: validSlugs } },
        select: QUESTION_SUMMARY_SELECT,
      });
      return this.formatQuestionSummaries(validSummaries);
      */
    return validSummaries;
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

    /*
    let cachedSummaries = await this.cache.getKeyInNamespace<
      QuestionSummaryFromDb[]
    >([NAMESPACES.QUESTIONS], question_summaries_for_topics);

    if (!cachedSummaries) {
      this.getAllSummaries();
      cachedSummaries = await this.cache.getKeyInNamespace<
        QuestionSummaryFromDb[]
      >([NAMESPACES.QUESTIONS], question_summaries);
    }
    */

    const validSummaries = await this.prisma.topicTag.findMany({
      where: { topicSlug: { in: validTopicTagArray } },
      select: {
        questionSummaries: {
          select: QUESTION_SUMMARY_SELECT,
        },
      },
    });
    // Array questions grouped by matched valid topic tags
    const flatValidSummaries: QuestionSummaryFromDb[][] = validSummaries.map(
      (v) => v.questionSummaries
    );

    const res: FlattenedQuestionSummary[] = this.filterSummaryByMatchType(
      flatValidSummaries,
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
}
