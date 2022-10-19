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

@Injectable()
export class QuestionService {
  constructor(private prisma: PrismaService) {}

  /**
   * Gets all the question summaries with the following fields:
   * acRate, difficulty, title, titleSlug, topicTags and updatedAt
   *
   * @return  Array of QuestionSummary with the relevant fields
   */
  async getAllSummaries() {
    const res: QuestionSummaryFromDb[] =
      await this.prisma.questionSummary.findMany({
        select: QUESTION_SUMMARY_SELECT,
      });

    return this.formatQuestionSummaries(res);
  }

  async getAllTopics() {
    const res = await this.prisma.topicTag.findMany({
      select: { topicSlug: true },
    });

    return res.map((slug) => slug.topicSlug);
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
    const res = await this.prisma.questionContent.findUniqueOrThrow({
      where: { titleSlug },
      select: QUESTION_CONTENT_SELECT,
    });
    return this.formatQuestionContent(res);
  }

  /**
   * @return  The content of the Daily Question
   */
  async getDailyQuestionContent() {
    const dailySlug = await this.prisma.questionSummary.findFirstOrThrow({
      where: { isDailyQuestion: true },
      select: { titleSlug: true },
    });

    return await this.getContentFromSlug(dailySlug.titleSlug);
  }

  /**
   * @return  {FlattenedQuestionSummary}  Summary of Daily Question
   */
  async getDailyQuestionSummary(): Promise<FlattenedQuestionSummary> {
    // Cron job ensures that there's only 1 QOTD at a time
    const dailySummary: QuestionSummaryFromDb =
      await this.prisma.questionSummary.findFirstOrThrow({
        where: { isDailyQuestion: true },
        select: QUESTION_SUMMARY_SELECT,
      });
    const [formattedSummary] = this.formatQuestionSummaries([dailySummary]);
    return formattedSummary;
  }

  async getSummariesFromDifficulty(difficulties: string[]) {
    const validDifficulties: QuestionSummaryFromDb[] =
      await this.prisma.questionSummary.findMany({
        where: { difficulty: { in: difficulties } },
        select: QUESTION_SUMMARY_SELECT,
      });

    return this.formatQuestionSummaries(validDifficulties);
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

    const validSummaries: QuestionSummaryFromDb[] =
      await this.prisma.questionSummary.findMany({
        where: { titleSlug: { in: validSlugs } },
        select: QUESTION_SUMMARY_SELECT,
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
