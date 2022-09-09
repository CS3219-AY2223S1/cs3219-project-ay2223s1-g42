import { Module } from "@nestjs/common";
import { MailerModule } from "@nestjs-modules/mailer";

import { RedisCacheModule } from "../cache/redisCache.module";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";


@Module({
  imports: [RedisCacheModule, MailerModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
