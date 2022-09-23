import { Controller, Get, Param } from "@nestjs/common";

import { QuestionService } from "./question.service";
import { PublicRoute } from "../utils/decorator";

@Controller("question")
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

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
  @Get("/summaries/titleSlugs/:titleSlugs")
  async getSummariesFromSlug(@Param("titleSlugs") titleSlugs: string) {
    const filteredSummaries = await this.questionService.getSummaryFromSlug(
      this.sanitizeParams(titleSlugs)
    );

    return filteredSummaries;
  }

  @PublicRoute()
  @Get("/summaries/topicTags/:topicTags")
  async getSummariesFromTopicTags(@Param("topicTags") topicTags: string) {
    const filteredSummaries =
      await this.questionService.getSummariesFromTopicTags(
        this.sanitizeParams(topicTags)
      );

    return filteredSummaries;
  }

  private sanitizeParams(param: string) {
    return param
      .split(",")
      .map((v) => v.trim())
      .map((v) => v.toLowerCase());
  }
}
