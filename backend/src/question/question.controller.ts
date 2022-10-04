import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import {
  ApiOperation,
  ApiOkResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
} from "@nestjs/swagger";

import { QuestionService } from "./question.service";
import { FlattenedQuestionSummary } from "./question.type";
import { QuestionQueryDto } from "./QuestionQuery.dto";
import { PublicRoute } from "../utils/decorator";
import { API_OPERATIONS, API_RESPONSES_DESCRIPTION } from "src/utils/constants";

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
  @ApiOperation({ summary: API_OPERATIONS.QUESTION_QUERY_SUMMARY })
  @ApiOkResponse({
    description: API_RESPONSES_DESCRIPTION.SUCCESSFUL_QUESTION_QUERY,
  })
  @ApiInternalServerErrorResponse({
    description: API_RESPONSES_DESCRIPTION.INTERNAL_SERVER_ERROR,
  })
  @ApiNotFoundResponse({
    description: API_RESPONSES_DESCRIPTION.NOT_FOUND_DESCRIPTION,
  })
  @Get("/summary")
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
  @ApiOperation({ summary: API_OPERATIONS.QUESTION_DAILY_SUMMARY })
  @ApiOkResponse({
    description: API_RESPONSES_DESCRIPTION.SUCCESSFUL_QUESTION_QUERY,
  })
  @ApiInternalServerErrorResponse({
    description: API_RESPONSES_DESCRIPTION.INTERNAL_SERVER_ERROR,
  })
  @ApiNotFoundResponse({
    description: API_RESPONSES_DESCRIPTION.NOT_FOUND_DESCRIPTION,
  })
  async getSummaryForDailyQuestion() {
    const dailySummary = await this.questionService.getDailyQuestionSummary();

    return dailySummary;
  }

  @PublicRoute()
  @ApiOperation({ summary: API_OPERATIONS.QUESTION_TOPIC_SUMMARY })
  @ApiOkResponse({
    description: API_RESPONSES_DESCRIPTION.SUCCESSFUL_QUESTION_QUERY,
  })
  @ApiInternalServerErrorResponse({
    description: API_RESPONSES_DESCRIPTION.INTERNAL_SERVER_ERROR,
  })
  @ApiNotFoundResponse({
    description: API_RESPONSES_DESCRIPTION.NOT_FOUND_DESCRIPTION,
  })
  @Get("/topics")
  async getAllTopics() {
    const topics = await this.questionService.getAllTopics();

    return topics;
  }

  @PublicRoute()
  @ApiOperation({ summary: API_OPERATIONS.QUESTION_DAILY_QUESTION_SUMMARY })
  @ApiOkResponse({
    description: API_RESPONSES_DESCRIPTION.SUCCESSFUL_QUESTION_QUERY,
  })
  @ApiInternalServerErrorResponse({
    description: API_RESPONSES_DESCRIPTION.INTERNAL_SERVER_ERROR,
  })
  @ApiNotFoundResponse({
    description: API_RESPONSES_DESCRIPTION.NOT_FOUND_DESCRIPTION,
  })
  @Get("/content/daily")
  async getContentForDailyQuestion() {
    const dailyContent = await this.questionService.getDailyQuestionContent();

    return dailyContent;
  }

  @PublicRoute()
  @ApiOperation({ summary: API_OPERATIONS.QUESTION_CONTENT_SLUG_SUMMARY })
  @ApiOkResponse({
    description: API_RESPONSES_DESCRIPTION.SUCCESSFUL_QUESTION_QUERY,
  })
  @ApiInternalServerErrorResponse({
    description: API_RESPONSES_DESCRIPTION.INTERNAL_SERVER_ERROR,
  })
  @ApiNotFoundResponse({
    description: API_RESPONSES_DESCRIPTION.NOT_FOUND_DESCRIPTION,
  })
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
