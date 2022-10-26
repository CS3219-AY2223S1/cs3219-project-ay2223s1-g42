import { Module } from "@nestjs/common";

import { QuestionService } from "./question.service";
import { QuestionController } from "./question.controller";
import { RedisCacheModule } from "../cache/redisCache.module";
@Module({
  controllers: [QuestionController],
  providers: [QuestionService],
  exports: [QuestionService],
  imports: [RedisCacheModule],
})
export class QuestionModule {}
