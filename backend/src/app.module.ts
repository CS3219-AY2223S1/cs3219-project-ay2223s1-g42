import { APP_PIPE } from "@nestjs/core";
import { Module } from "@nestjs/common";
import { ZodValidationPipe } from "nestjs-zod";

import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { QuestionModule } from "./question/question.module";
import { PrismaModule } from "./prisma/prisma.module";

@Module({
  imports: [UserModule, QuestionModule, PrismaModule, AuthModule],
  providers: [{ provide: APP_PIPE, useClass: ZodValidationPipe }],
})
export class AppModule {}
