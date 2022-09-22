import { Controller, Get, Param, Query } from "@nestjs/common";

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

  //TODO: Ensure that the routes below work
  //TODO: Ensure that string[] is being passed, currently if string[].length == 1,
  //TODO:  NodeJS takes it as a char[].

  @PublicRoute()
  @Get("/summaries")
  async getSummariesFromSlug(@Query() titleSlugs: { titleSlug: string[] }) {
    const filteredSummaries = await this.questionService.getSummaryFromSlug(
      titleSlugs
    );

    return filteredSummaries;
  }

  @PublicRoute()
  @Get("/summaries")
  async getSummariesFromTopicTags(@Query() topics: { topic: string[] }) {
    const filteredSummaries =
      await this.questionService.getSummariesFromTopicTags(topics);

    return filteredSummaries;
  }
}
