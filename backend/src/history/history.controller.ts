import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Post,
} from "@nestjs/common";

import { HistoryService } from "./history.service";
import { PublicRoute } from "../utils";
import { HistoryDto } from "./history.dto";

@Controller("history")
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @PublicRoute()
  @Post("")
  async addToUserHistory(@Body() historyInfo: HistoryDto) {
    const { content, roomId, titleSlug, username } = historyInfo;

    const res = { message: "pending" };
    this.historyService
      .addHistory(username, titleSlug, content, roomId)
      .then(() => (res.message = "success"))
      .catch(() => (res.message = "failed"));
    return res;
  }

  @PublicRoute()
  @Get(":username")
  async getUserHistory(@Param("username") username: string) {
    const userHistory = await this.historyService.getHistory(username);
    return userHistory.length == 0 ? "User history is empty" : userHistory;
  }

  @PublicRoute()
  @Get(":username/:titleSlug")
  async getUserQuestionHistory(
    @Param("username") username: string,
    @Param("titleSlug") titleSlug: string
  ) {
    const userQuestionHistory = await this.historyService.getHistory(
      username,
      titleSlug
    );
    return userQuestionHistory.length == 0
      ? "User history is empty"
      : userQuestionHistory;
  }

  @PublicRoute()
  @Post("invalidateCache")
  async invalidateCache() {
    try {
      await this.historyService.invalidateAllHistoryCache();
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  @PublicRoute()
  @Post("invalidateCache/:username")
  async invalidSpecificCache(@Param("username") username: string) {
    try {
      await this.historyService.invalidateSpecificHistoryCache(username);
      return { message: "success" };
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
