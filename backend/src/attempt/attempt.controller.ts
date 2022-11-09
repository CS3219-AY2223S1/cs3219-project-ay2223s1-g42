import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Param,
  Post,
} from "@nestjs/common";

import { UserInfo, AttemptInfo, GetAttemptsResponse } from "shared/api";
import { AttemptService } from "./attempt.service";
import { API_OPERATIONS, API_RESPONSES_DESCRIPTION, GetUser } from "../utils";
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";

@Controller("attempt")
export class AttemptController {
  constructor(private readonly attemptService: AttemptService) {}

  @Post()
  @ApiTags("Attempt API routes")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: API_OPERATIONS.ATTEMPT_CREATED })
  @ApiCreatedResponse({
    description: API_RESPONSES_DESCRIPTION.SUCCESSFUL_ATTEMPT_REGISTERED,
  })
  @ApiBadRequestResponse({
    description:
      API_RESPONSES_DESCRIPTION.BAD_REQUEST_INVALID_CREDENTIALS_DESCRIPTION,
  })
  @ApiUnauthorizedResponse({
    description: API_RESPONSES_DESCRIPTION.UNAUTHORIZED_ACCESS_DESCRIPTION,
  })
  @ApiInternalServerErrorResponse({
    description: API_RESPONSES_DESCRIPTION.INTERNAL_SERVER_ERROR,
  })
  async upsertAttempt(
    @GetUser() { id }: UserInfo,
    @Body() attemptInfo: AttemptInfo
  ) {
    const { content, titleSlug, title, roomId } = attemptInfo;
    try {
      await this.attemptService.upsertAttempt(
        id,
        roomId,
        title,
        titleSlug,
        content
      );
      return { message: "Successfully upserted attempt." };
    } catch (err) {
      throw new BadRequestException("Failed to upsert attempt.");
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: API_OPERATIONS.RETRIEVE_ATTEMPTS_SUMMARIES })
  @ApiOkResponse({
    description: API_RESPONSES_DESCRIPTION.SUCCESSFUL_ATTEMPTS_RETRIEVED,
  })
  @ApiBadRequestResponse({
    description:
      API_RESPONSES_DESCRIPTION.BAD_REQUEST_INVALID_CREDENTIALS_DESCRIPTION,
  })
  @ApiUnauthorizedResponse({
    description: API_RESPONSES_DESCRIPTION.UNAUTHORIZED_ACCESS_DESCRIPTION,
  })
  @ApiInternalServerErrorResponse({
    description: API_RESPONSES_DESCRIPTION.INTERNAL_SERVER_ERROR,
  })
  @ApiTags("Attempt API routes")
  async getUserAttempts(
    @GetUser() { id }: UserInfo
  ): Promise<GetAttemptsResponse> {
    try {
      const attempts = await this.attemptService.getAttempts(id);
      if (!Array.isArray(attempts)) {
        return [attempts];
      }
      return attempts;
    } catch (err) {
      console.error(err);
      return [];
    }
  }

  @Get(":titleSlug")
  @ApiTags("Attempt API routes")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: API_OPERATIONS.RETRIEVE_SPECIFIC_ATTEMPT_SUMMARY })
  @ApiOkResponse({
    description:
      API_RESPONSES_DESCRIPTION.SUCCESSFUL_ATTEMPT_TITLESLUG_RETRIEVED,
  })
  @ApiBadRequestResponse({
    description:
      API_RESPONSES_DESCRIPTION.BAD_REQUEST_INVALID_CREDENTIALS_DESCRIPTION,
  })
  @ApiUnauthorizedResponse({
    description: API_RESPONSES_DESCRIPTION.UNAUTHORIZED_ACCESS_DESCRIPTION,
  })
  @ApiInternalServerErrorResponse({
    description: API_RESPONSES_DESCRIPTION.INTERNAL_SERVER_ERROR,
  })
  async getUserQuestionAttempts(
    @GetUser() { id }: UserInfo,
    @Param("titleSlug") titleSlug: string
  ): Promise<GetAttemptsResponse> {
    try {
      const userQuestionAttempts = await this.attemptService.getAttempts(
        id,
        titleSlug
      );
      if (!Array.isArray(userQuestionAttempts)) {
        return [userQuestionAttempts];
      }
      return userQuestionAttempts;
    } catch (err) {
      console.error(err);
      return [];
    }
  }

  @Post("invalidateCache")
  @ApiTags("Attempt API routes")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: API_OPERATIONS.INVALIDATE_CACHE_SUMMARY })
  @ApiCreatedResponse({
    description: API_RESPONSES_DESCRIPTION.SUCCESSFUL_ATTEMPT_INVALIDATE_CACHE,
  })
  @ApiBadRequestResponse({
    description:
      API_RESPONSES_DESCRIPTION.BAD_REQUEST_INVALID_CREDENTIALS_DESCRIPTION,
  })
  @ApiUnauthorizedResponse({
    description: API_RESPONSES_DESCRIPTION.UNAUTHORIZED_ACCESS_DESCRIPTION,
  })
  @ApiInternalServerErrorResponse({
    description: API_RESPONSES_DESCRIPTION.INTERNAL_SERVER_ERROR,
  })
  async invalidateAllAttemptsCache() {
    try {
      await this.attemptService.invalidateAllAttemptsCache();
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
