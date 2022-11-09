import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Post,
} from "@nestjs/common";

import { UserInfo } from "shared/api";
import { HistoryService } from "./history.service";
import { HistoryDto } from "./history.dto";
import { GetUser } from "../utils";

@Controller("history")
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Post()
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
  async getUserHistory(@GetUser() { username }: UserInfo) {
    const userHistory = await this.historyService.getHistory(username);
    return userHistory;
  }

  @Get(":titleSlug")
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
  async invalidateAllHistoryCache() {
    try {
      await this.historyService.invalidateAllHistoryCache();
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
