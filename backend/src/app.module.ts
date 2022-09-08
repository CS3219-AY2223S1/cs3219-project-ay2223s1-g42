import { APP_GUARD, APP_PIPE } from "@nestjs/core";
import { Module } from "@nestjs/common";
import { ZodValidationPipe } from "nestjs-zod";
import { ConfigModule } from "@nestjs/config";

import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { QuestionModule } from "./question/question.module";
import { PrismaModule } from "./prisma/prisma.module";
import { MatchModule } from "./match/match.module";
import { validate, configuration } from "./config";
import { JwtAccessGuard } from "./auth/guard";
import { RedisCacheModule } from "./cache/redisCache.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [".env.local", ".env"],
      load: [configuration],
      validate,
      isGlobal: true,
    }),
    PrismaModule,
    UserModule,
    QuestionModule,
    AuthModule,
    MatchModule,
    RedisCacheModule,
  ],
  providers: [
    { provide: APP_PIPE, useClass: ZodValidationPipe },
    { provide: APP_GUARD, useClass: JwtAccessGuard },
  ],
})
export class AppModule {}
