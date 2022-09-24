import { Controller, Get, Param, Query } from "@nestjs/common";

import { QuestionService } from "./question.service";
import { FlattenedQuestionSummary } from "./question.type";
import { PublicRoute } from "../utils/decorator";

@Controller("question")
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @PublicRoute()
  @Get(["", "/summary"])
  async getSummeries(
    @Query("titleSlugs") titleSlugs: string | string[] | undefined,
    @Query("topicTags") topicTags: string | string[] | undefined
  ) {
    // if nether are specified
    if (!titleSlugs && !topicTags) {
      const summaries = await this.questionService.getSummaries();
      return summaries;
    }

    const summaries: Record<string, FlattenedQuestionSummary> = {};
    if (titleSlugs) {
      const res = await this.questionService.getSummariesFromSlug(
        this.sanitizeQuery(titleSlugs)
      );
      res.forEach((v) => (summaries[v.titleSlug] = v));
    }

    if (topicTags) {
      const res = await this.questionService.getSummariesFromTopicTags(
        this.sanitizeQuery(topicTags)
      );
      res.forEach((v) => {
        if (!summaries[v.titleSlug]) {
          summaries[v.titleSlug] = v;
        }
      });
    }

    return Object.values(summaries);
  }

  @PublicRoute()
  @Get("/summary/daily")
  async getSummaryForDailyQuestion() {
    const dailySummary = await this.questionService.getDailyQuestionSummary();

    return dailySummary;
  }

  @PublicRoute()
  @Get("/topics")
  async getAllTopics() {
    const topics = await this.questionService.getAllTopics();

    return topics;
  }

  @PublicRoute()
  @Get("/content/daily")
  async getContentForDailyQuestion() {
    const dailyContent = await this.questionService.getDailyQuestionContent();

    return dailyContent;
  }

  @PublicRoute()
  @Get("/content/:titleSlug")
  async getContentFromSlug(@Param("titleSlug") titleSlug: string) {
    const questionContent = await this.questionService.getContentFromSlug(
      titleSlug
    );

    return questionContent;
  }

  // ***** HELPER FUNCTION ***** //
  // Can possibly replace this using a DTO
  private sanitizeQuery(query: string | string[], separator = ",") {
    const splitQuery: string[] = [];
    if (!Array.isArray(query)) {
      splitQuery.push(...query.split(separator));
    } else {
      splitQuery.push(...query.flatMap((v) => v.split(",")));
    }

    return splitQuery.reduce((prev: string[], curr) => {
      if (curr.trim()) {
        prev.push(curr.trim().toLowerCase());
      }
      return prev;
    }, []);
  }
}
