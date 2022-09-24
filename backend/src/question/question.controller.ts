import { Controller, Get, Param, ParseArrayPipe, Query } from "@nestjs/common";

import { QuestionService } from "./question.service";
import { PublicRoute } from "../utils/decorator";

@Controller("question")
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

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

  @PublicRoute()
  @Get("/summaries/all")
  async getSummeries() {
    const questionSummaries = await this.questionService.getSummaries();

    return questionSummaries;
  }

  @PublicRoute()
  @Get("/summaries/daily")
  async getSummaryForDailyQuestion() {
    const dailySummary = await this.questionService.getDailyQuestionSummary();

    return dailySummary;
  }

  @PublicRoute()
  @Get("/summaries/title/")
  async getSummariesFromTitleSlug(
    @Query("slugs", new ParseArrayPipe({ items: String, separator: "," }))
    slugs: string[]
  ) {
    const summaries = this.questionService.getSummariesFromSlug(
      this.sanitizeQuery(slugs)
    );

    return summaries;
  }

  @PublicRoute()
  @Get("/summaries/topic/")
  async getSummariesFromTopicTags(
    @Query("tags", new ParseArrayPipe({ items: String, separator: "," }))
    tags: string[]
  ) {
    const summaries = this.questionService.getSummariesFromTopicTags(
      this.sanitizeQuery(tags)
    );

    return summaries;
  }

  private sanitizeQuery(query: string[]) {
    return query.reduce((prev: string[], curr) => {
      if (curr.trim()) {
        prev.push(curr.trim().toLowerCase());
      }
      return prev;
    }, []);
  }
}
