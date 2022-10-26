import { Module } from "@nestjs/common";

import { QuestionService } from "./question.service";
import { QuestionController } from "./question.controller";
import { RedisCacheModule } from "../cache/redisCache.module";
import { CronService } from "./questions.cron.service";

@Module({
  controllers: [QuestionController],
  providers: [QuestionService, CronService],
  exports: [QuestionService],
  imports: [RedisCacheModule],
})
export class QuestionModule {}
