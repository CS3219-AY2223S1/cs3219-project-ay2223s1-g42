import { Module } from "@nestjs/common";

import { QuestionService } from "./questions.service";
import { QuestionController } from "./questions.controller";

@Module({
  controllers: [QuestionController],
  providers: [QuestionService],
  exports: [QuestionService],
})
export class QuestionModule {}
