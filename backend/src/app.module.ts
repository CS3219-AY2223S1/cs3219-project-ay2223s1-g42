import { APP_GUARD, APP_PIPE } from "@nestjs/core";
import { Module } from "@nestjs/common";
import { ZodValidationPipe } from "@anatine/zod-nestjs";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MailerModule } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { ScheduleModule } from "@nestjs/schedule";

import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { PrismaModule } from "./prisma/prisma.module";
import { validate, configuration } from "./config";
import { JwtAccessGuard } from "./auth/guard";
import { RedisCacheModule } from "./cache/redisCache.module";
import { generateEmailFromField } from "./utils/mail";
import { MatchModule } from "./match/match.module";
import { RoomModule } from "./room/room.module";
import { DocumentModule } from "./document/document.module";
import { QuestionModule } from "./question/question.module";
import { HistoryModule } from "./history/history.module";

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      envFilePath: [".env.local", ".env"],
      load: [configuration],
      validate,
      isGlobal: true,
    }),
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get("SMTP_HOST"),
          port: configService.get("SMTP_PORT"),
          secure: false, // upgrade later with STARTTLS
          auth: {
            user: configService.get("SMTP_EMAIL"),
            pass: configService.get("SMTP_PASSWORD"),
          },
        },
        defaults: {
          from: generateEmailFromField(
            configService.get("SMTP_NAME"),
            configService.get("SMTP_EMAIL")
          ),
        },
        template: {
          dir: process.cwd() + "/templates/",
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
    RedisCacheModule,
    PrismaModule,
    UserModule,
    QuestionModule,
    AuthModule,
    RoomModule,
    DocumentModule,
    MatchModule,
    HistoryModule,
  ],
  providers: [
    { provide: APP_PIPE, useClass: ZodValidationPipe },
    { provide: APP_GUARD, useClass: JwtAccessGuard },
  ],
})
export class AppModule {}
