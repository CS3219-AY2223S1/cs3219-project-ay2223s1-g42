import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Post,
} from "@nestjs/common";

import { UserInfo, AttemptInfo } from "shared/api";
import { AttemptService } from "./attempt.service";
import { GetUser } from "../utils";

@Controller("attempt")
export class AttemptController {
  constructor(private readonly attemptService: AttemptService) {}

  @Post()
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
  async getUserAttempts(@GetUser() { id }: UserInfo) {
    const attempts = await this.attemptService.getAttempts(id);
    return attempts;
  }

  @Get(":titleSlug")
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
  async invalidateAllAttemptsCache() {
    try {
      await this.attemptService.invalidateAllAttemptsCache();
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
