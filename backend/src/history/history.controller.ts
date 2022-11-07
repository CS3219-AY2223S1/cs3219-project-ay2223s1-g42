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

import { UserInfo } from "shared/api";
import { HistoryService } from "./history.service";
import { HistoryDto } from "./history.dto";
import { API_RESPONSES_DESCRIPTION, GetUser } from "../utils";
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";

@Controller("history")
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiTags("History API routes")
  @ApiCreatedResponse({
    description: API_RESPONSES_DESCRIPTION.SUCCESSFUL_HISTORY_ADDED,
  })
  @ApiUnauthorizedResponse({
    description: API_RESPONSES_DESCRIPTION.UNAUTHORIZED_ACCESS_DESCRIPTION,
  })
  @ApiBadRequestResponse({
    description: API_RESPONSES_DESCRIPTION.BAD_REQUEST_DESCRIPTION,
  })
  @ApiForbiddenResponse({
    description: API_RESPONSES_DESCRIPTION.FORBIDDEN_DESCRIPTION,
  })
  @ApiInternalServerErrorResponse({
    description: API_RESPONSES_DESCRIPTION.INTERNAL_SERVER_ERROR,
  })
  async addToUserHistory(
    @GetUser() { username }: UserInfo,
    @Body() historyInfo: HistoryDto
  ) {
    const { content, titleSlug, title } = historyInfo;

    const res = { message: "pending" };
    await this.historyService
      .addHistory(username, title, titleSlug, content)
      .then(() => (res.message = "success"))
      .catch(() => (res.message = "failed"));
    return res;
  }

  @Get()
  @ApiTags("History API routes")
  @ApiOkResponse({
    description:
      API_RESPONSES_DESCRIPTION.SUCCESSFUL_RETRIEVAL_OF_USER_INFORMATION_DESCRIPTION,
  })
  @ApiUnauthorizedResponse({
    description: API_RESPONSES_DESCRIPTION.UNAUTHORIZED_ACCESS_DESCRIPTION,
  })
  @ApiBadRequestResponse({
    description: API_RESPONSES_DESCRIPTION.BAD_REQUEST_DESCRIPTION,
  })
  @ApiForbiddenResponse({
    description: API_RESPONSES_DESCRIPTION.FORBIDDEN_DESCRIPTION,
  })
  @ApiInternalServerErrorResponse({
    description: API_RESPONSES_DESCRIPTION.INTERNAL_SERVER_ERROR,
  })
  async getUserHistory(@GetUser() { username }: UserInfo) {
    const userHistory = await this.historyService.getHistory(username);
    return userHistory;
  }

  @Get(":titleSlug")
  @ApiTags("History API routes")
  @ApiOkResponse({
    description:
      API_RESPONSES_DESCRIPTION.SUCCESSFUL_RETRIEVAL_OF_USER_INFORMATION_DESCRIPTION,
  })
  @ApiUnauthorizedResponse({
    description: API_RESPONSES_DESCRIPTION.UNAUTHORIZED_ACCESS_DESCRIPTION,
  })
  @ApiBadRequestResponse({
    description: API_RESPONSES_DESCRIPTION.BAD_REQUEST_DESCRIPTION,
  })
  @ApiForbiddenResponse({
    description: API_RESPONSES_DESCRIPTION.FORBIDDEN_DESCRIPTION,
  })
  @ApiInternalServerErrorResponse({
    description: API_RESPONSES_DESCRIPTION.INTERNAL_SERVER_ERROR,
  })
  async getUserQuestionHistory(
    @GetUser() { username }: UserInfo,
    @Param("titleSlug") titleSlug: string
  ) {
    const userQuestionHistory = await this.historyService.getHistory(
      username,
      titleSlug
    );
    return userQuestionHistory;
  }

  @Post("invalidateCache")
  @ApiTags("History API routes")
  @ApiCreatedResponse({
    description: API_RESPONSES_DESCRIPTION.SUCCESSFUL_HISTORY_INVALIDATION,
  })
  @ApiUnauthorizedResponse({
    description: API_RESPONSES_DESCRIPTION.UNAUTHORIZED_ACCESS_DESCRIPTION,
  })
  @ApiBadRequestResponse({
    description: API_RESPONSES_DESCRIPTION.BAD_REQUEST_DESCRIPTION,
  })
  @ApiForbiddenResponse({
    description: API_RESPONSES_DESCRIPTION.FORBIDDEN_DESCRIPTION,
  })
  @ApiInternalServerErrorResponse({
    description: API_RESPONSES_DESCRIPTION.INTERNAL_SERVER_ERROR,
  })
  async invalidateAllHistoryCache() {
    try {
      await this.historyService.invalidateAllHistoryCache();
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
