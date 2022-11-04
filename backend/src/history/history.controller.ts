import {
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Post,
} from "@nestjs/common";

import { HistoryService } from "./history.service";

@Controller("history")
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

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
  async invalidateCache() {
    try {
      await this.historyService.invalidateHistoryCache();
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
