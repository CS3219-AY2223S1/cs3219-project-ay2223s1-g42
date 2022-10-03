import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";

import { QuestionService } from "./question.service";
import { FlattenedQuestionSummary } from "./question.type";
import { PublicRoute } from "../utils/decorator";
import { QuestionQueryDto } from "./QuestionQuery.dto";

@Controller("question")
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @PublicRoute()
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    })
  )
  @Get(["", "/summary"])
  async getSummaries(@Query() query: QuestionQueryDto) {
    const { difficulty, titleSlugs, topicMatch, topicTags } = query;

    // if none specified
    if (!difficulty && !titleSlugs && !topicTags) {
      const summaries = await this.questionService.getAllSummaries();
      return summaries;
    }

    const filterMap: Record<string, FlattenedQuestionSummary> = {};

    if (difficulty) {
      const res = await this.questionService.getSummariesFromDifficulty(
        difficulty
      );
      res.forEach((v) => {
        const { titleSlug } = v;
        if (!filterMap[titleSlug]) {
          filterMap[titleSlug] = v;
        }
      });
    }

    if (titleSlugs) {
      const res = await this.questionService.getSummariesFromSlug(titleSlugs);
      res.forEach((v) => {
        const { titleSlug } = v;
        if (!filterMap[titleSlug]) {
          filterMap[titleSlug] = v;
        }
      });
    }

    if (topicTags) {
      const res = await this.questionService.getSummariesFromTopicTags(
        topicTags,
        topicMatch
      );
      res.forEach((v) => {
        const { titleSlug } = v;
        if (!filterMap[titleSlug]) {
          filterMap[titleSlug] = v;
        }
      });
    }

    return Object.values(filterMap);
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
    try {
      const questionContent = await this.questionService.getContentFromSlug(
        titleSlug
      );

      return questionContent;
    } catch (error) {
      throw new BadRequestException(`unable to get content for '${titleSlug}'`);
    }
  }
}
