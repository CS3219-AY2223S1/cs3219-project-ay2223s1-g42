import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Post,
} from "@nestjs/common";

import { UserInfo, AttemptInfo, GetAttemptsResponse } from "shared/api";
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
  async invalidateAllAttemptsCache() {
    try {
      await this.attemptService.invalidateAllAttemptsCache();
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
