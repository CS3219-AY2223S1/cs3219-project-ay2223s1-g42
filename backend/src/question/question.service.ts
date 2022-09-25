import { Injectable } from "@nestjs/common";

import {
  FlattenedQuestionContent,
  FlattenedQuestionSummary,
  QuestionSummaryFromDb,
  QUESTION_SUMMARY_SELECT,
} from "./question.type";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class QuestionService {
  constructor(private prisma: PrismaService) {}

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
      select: {
        content: true,
        hints: true,
        summary: {
          include: {
            topicTags: true,
          },
        },
      },
    });

    return {
      content: res.content,
      discussionLink: this.getDiscussionLink(titleSlug),
      hints: res.hints.map((v) => v.hint),
      topicTags: res.summary.topicTags.map((v) => v.topicSlug),
    };
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
   * Gets all the question summaries with the following fields:
   * acRate, difficulty, title, titleSlug, topicTags and updatedAt
   *
   * @return  Array of QuestionSummary with the relevant fields
   */
  async getSummaries() {
    const res: QuestionSummaryFromDb[] =
      await this.prisma.questionSummary.findMany({
        select: { ...QUESTION_SUMMARY_SELECT },
      });

    return this.toQuestionSummaryTableType(res);
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
    const res: QuestionSummaryFromDb[] =
      await this.prisma.questionSummary.findMany({
        where: { titleSlug: { in: titleSlugs } },
        select: { ...QUESTION_SUMMARY_SELECT },
      });

    return this.toQuestionSummaryTableType(res);
  }

  /**
   * @return  {QuestionSummary}  Summary of Daily Question
   */
  async getDailyQuestionSummary() {
    // Cron job ensures that there's only 1 QOTD at a time
    const dailySummary: QuestionSummaryFromDb[] =
      await this.prisma.questionSummary.findMany({
        where: { isDailyQuestion: true },
        select: { ...QUESTION_SUMMARY_SELECT },
      });

    return this.toQuestionSummaryTableType(dailySummary);
  }

  /**
   * Gets a list of summaries that matches the given topics iff all of them are valid
   * and intersect. Else, return an empty array.
   *
   * @param   {string[]}  topicTags  Array of topics to match
   *
   * @return  Array of matching, flattened QuestionSummary
   */
  async getSummariesFromTopicTags(
    topicTags: string[]
  ): Promise<FlattenedQuestionSummary[]> {
    const res = await this.prisma.topicTag.findMany({
      where: { topicSlug: { in: topicTags } },
      select: { questionSummaries: { select: { titleSlug: true } } },
    });

    // consist of at least one invalid tag
    if (topicTags.length != res.length) {
      return [];
    }

    const slugArrays: string[][] = [];
    for (const { questionSummaries } of res) {
      slugArrays.push(questionSummaries.map((slug) => slug.titleSlug));
    }

    if (slugArrays.length === 1) {
      return await this.getSummariesFromSlug(slugArrays.flat());
    }

    // Gets intersection of arrays (AND filter)
    const intersect = slugArrays.reduce((prev, curr) =>
      curr.filter(Set.prototype.has, new Set(prev))
    );

    return await this.getSummariesFromSlug(intersect);
  }

  async getAllTopics() {
    const res = await this.prisma.topicTag.findMany({
      select: { topicSlug: true },
    });

    return res.map((slug) => slug.topicSlug);
  }

  // ***** HELPER FUNCTIONS ***** //

  /**
   * Helper method to shape QuestionSummaryTableType into a consumer-friendly formay.
   *
   * @param   {QuestionSummaryFromDb[]}  data Raw data formatted by Prisma
   *
   * @return  {FlattenedQuestionSummary[]}  "Flattened" QuestionSummaryTableType
   */
  private toQuestionSummaryTableType(
    data: QuestionSummaryFromDb[]
  ): FlattenedQuestionSummary[] {
    const normData = [
      ...data.map((summary) => {
        const { topicTags, updatedAt, titleSlug, ...info } = summary;
        return {
          ...info,
          discussionLink: this.getDiscussionLink(titleSlug),
          topicTags: topicTags.map((tag) => tag.topicSlug),
          titleSlug,
          updatedAt,
        };
      }),
    ];

    return normData;
  }

  private getDiscussionLink(titleSlug: string) {
    return (
      `https://leetcode.com/problems/${titleSlug}` +
      `/discuss/?currentPage=1&orderBy=most_votes&query=`
    );
  }
}
