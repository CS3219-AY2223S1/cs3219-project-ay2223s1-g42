import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_PIPE } from "@nestjs/core";
import { ZodValidationPipe } from "nestjs-zod";

import { AuthService } from "./auth/auth.service";
import { ChatModule } from "./chat/chat.module";
import { validate, configuration } from "./config";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [".env.local", ".env"],
      load: [configuration],
      validate,
      isGlobal: true,
    }),
    ChatModule,
  ],
  providers: [{ provide: APP_PIPE, useClass: ZodValidationPipe }],
})
export class AppModule {}

// @Module({
//   imports: [
//     ConfigModule.forRoot({
//       envFilePath: [".env.local", ".env"],
//       load: [configuration],
//       validate,
//       isGlobal: true,
//     }),
//     ChatModule,
//   ],
//   providers: [{ provide: APP_PIPE, useClass: ZodValidationPipe }],
// })
// export class AppModule {}
