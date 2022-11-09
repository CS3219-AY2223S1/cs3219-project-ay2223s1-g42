import { Module } from "@nestjs/common";

import { AttemptController } from "./attempt.controller";
import { AttemptService } from "./attempt.service";
import { RedisCacheModule } from "../cache/redisCache.module";

@Module({
  controllers: [AttemptController],
  providers: [AttemptService],
  exports: [AttemptService],
  imports: [RedisCacheModule],
})
export class AttemptModule {}
