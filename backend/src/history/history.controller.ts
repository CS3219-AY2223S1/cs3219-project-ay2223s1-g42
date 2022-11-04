import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Post,
} from "@nestjs/common";

import { HistoryService } from "./history.service";
import { HistoryDto } from "./history.dto";

//! To test routes, decorate them with @PublicRoute()
@Controller("history")
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Post("")
  async addToUserHistory(@Body() historyInfo: HistoryDto) {
    const { content, titleSlug, username } = historyInfo;

    const res = { message: "pending" };
    await this.historyService
      .addHistory(username, titleSlug, content)
      .then(() => (res.message = "success"))
      .catch(() => (res.message = "failed"));
    return res;
  }

  @Get(":username")
  async getUserHistory(@Param("username") username: string) {
    const userHistory = await this.historyService.getHistory(username);
    return userHistory;
  }

  @Get(":username/:titleSlug")
  async getUserQuestionHistory(
    @Param("username") username: string,
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
