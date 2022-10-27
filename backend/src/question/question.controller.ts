import {
  BadRequestException,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Query,
  UsePipes,
} from "@nestjs/common";
import {
  ApiOperation,
  ApiOkResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiTags,
} from "@nestjs/swagger";
import { ZodValidationPipe } from "@anatine/zod-nestjs";

import {
  GetSummariesResponse,
  FlattenedQuestionSummary,
  GetDailyQuestionSummaryResponse,
  GetAllTopicsResponse,
  GetDailyQuestionContentResponse,
  GetSlugContentResponse,
} from "shared/api";
import { QuestionService } from "./question.service";
import { PublicRoute } from "../utils/decorator";
import { API_OPERATIONS, API_RESPONSES_DESCRIPTION } from "../utils/constants";
import { QuestionQuerySchemaDto } from "./question.dto";

@Controller("question")
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @PublicRoute()
  @UsePipes(ZodValidationPipe)
  @ApiTags("Question API routes")
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
  async getSummaries(
    @Query() query: QuestionQuerySchemaDto
  ): Promise<GetSummariesResponse> {
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
  @ApiTags("Question API routes")
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
  async getDailyQuestionSummary(): Promise<GetDailyQuestionSummaryResponse> {
    const dailySummary = await this.questionService.getDailyQuestionSummary();
    return dailySummary;
  }

  @PublicRoute()
  @ApiTags("Question API routes")
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
  async getAllTopics(): Promise<GetAllTopicsResponse> {
    const topics = await this.questionService.getAllTopics();
    return topics;
  }

  @PublicRoute()
  @ApiTags("Question API routes")
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
  async getDailyQuestionContent(): Promise<GetDailyQuestionContentResponse> {
    const dailyContent = await this.questionService.getDailyQuestionContent();
    return dailyContent;
  }

  @PublicRoute()
  @ApiTags("Question API routes")
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
  async getSlugContent(
    @Param("titleSlug") titleSlug: string
  ): Promise<GetSlugContentResponse> {
    try {
      const questionContent = await this.questionService.getContentFromSlug(
        titleSlug
      );
      return questionContent;
    } catch (error) {
      throw new BadRequestException(`unable to get content for '${titleSlug}'`);
    }
  }

  @PublicRoute()
  @ApiTags("Question API routes")
  @ApiOperation({ summary: API_OPERATIONS.QUESTION_INVALIDATE_CACHE })
  @ApiOkResponse({
    description: API_RESPONSES_DESCRIPTION.SUCCESSFUL_QUESTION_INVALIDATION,
  })
  @ApiInternalServerErrorResponse({
    description: API_RESPONSES_DESCRIPTION.INTERNAL_SERVER_ERROR,
  })
  @Post("/invalidateCache")
  async invalidateCache() {
    try {
      await this.questionService.invalidateQuestionCache();
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
