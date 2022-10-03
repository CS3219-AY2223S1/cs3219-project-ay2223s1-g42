import { Module } from "@nestjs/common";

import { QuestionService } from "./question.service";
import { QuestionController } from "./question.controller";

@Module({
  controllers: [QuestionController],
  providers: [QuestionService],
  exports: [QuestionService],
})
export class QuestionModule {}
