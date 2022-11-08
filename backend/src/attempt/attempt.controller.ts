import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Param,
  Post,
} from "@nestjs/common";

import { UserInfo, AttemptInfo } from "shared/api";
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
    description: API_RESPONSES_DESCRIPTION.SUCCESSFUL_ATTEMPT_REGISTED,
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

    const res = { message: "pending" };
    await this.attemptService
      .upsertAttempt(id, roomId, title, titleSlug, content)
      .then(() => (res.message = "success"))
      .catch(() => (res.message = "failed"));
    return res;
  }

  @Get()
  @HttpCode(HttpStatus.OK)
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
  async getUserAttempts(@GetUser() { id }: UserInfo) {
    const attempts = await this.attemptService.getAttempts(id);
    return attempts;
  }

  @Get(":titleSlug")
  @ApiTags("Attempt API routes")
  @HttpCode(HttpStatus.OK)
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
  ) {
    const userQuestionAttempts = await this.attemptService.getAttempts(
      id,
      titleSlug
    );
    return userQuestionAttempts;
  }

  @Post("invalidateCache")
  @ApiTags("Attempt API routes")
  @HttpCode(HttpStatus.CREATED)
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
