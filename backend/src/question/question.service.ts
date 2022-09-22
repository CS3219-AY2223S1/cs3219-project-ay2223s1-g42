import { Injectable } from "@nestjs/common";
import { QuestionSummary, Prisma } from "@prisma/client";

import { PrismaService } from "../prisma/prisma.service";

type QuestionSummaryTableType = Pick<
  QuestionSummary,
  "acRate" | "difficulty" | "title" | "titleSlug" | "updatedAt"
>;

// type TitleSlugsQueryType = {
//   titleSlug: string[];
// };

const QUESTION_SUMMARY_TABLE_FIELDS: Prisma.QuestionSummarySelect = {
  acRate: true,
  difficulty: true,
  title: true,
  titleSlug: true,
  topicTags: { select: { name: true } },
  updatedAt: true,
};

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
  async getContentFromSlug(titleSlug: string) {
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
      content: res.content.toString(),
      hints: res.hints.map((v) => v.hintBuffer.toString()),
      topicTags: res.summary.topicTags.map((v) => v.name),
    };
  }

  /**
   * Gets all the question summaries with the following fields:
   * acRate, difficulty, title, titleSlug, topicTags and updatedAt
   *
   * @return  Array of QuestionSummary with the relevant fields
   */
  async getSummaries() {
    const res = await this.prisma.questionSummary.findMany({
      select: { ...QUESTION_SUMMARY_TABLE_FIELDS },
    });
    return this.toQuestionSummaryTableType(res);
  }

  /**
   * Gets a summary that matches the unique title slug
   *
   * @param   {string} titleSlug  title slug associated to the question
   *
   * @return  {QuestionSummary} Corresponding QuestionSummary to the title slug
   * @throws  NotFoundError
   */
  async getSummaryFromSlug(titleSlugs: { titleSlug: string[] }) {
    const res = await this.prisma.questionSummary.findMany({
      where: { titleSlug: { in: titleSlugs.titleSlug } },
      select: { ...QUESTION_SUMMARY_TABLE_FIELDS },
    });

    return this.toQuestionSummaryTableType(res);
  }

  /**
   * Gets all the summaries that matches all the given the topic tags.
   *
   * @param {string[]} topicTags Array of topics to match
   *
   * @return Array of QuestionSummaries that matches all of the given tags.
   */
  async getSummariesFromTopicTags(topics: { topic: string[] }) {
    // Prisma doesnt allow application of multiple filters on the same key
    // const slugMap: Record<string, number> = {};
  }

  private toQuestionSummaryTableType(res: any) {
    return [
      ...res.map((v) => {
        const { topicTags, ...info } = v as QuestionSummaryTableType & {
          topicTags: { name: string }[];
        };
        return {
          ...info,
          topicTags: [...topicTags.map((v) => v.name)],
        };
      }),
    ];
  }
}
