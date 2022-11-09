import { Module } from "@nestjs/common";

import { HistoryController } from "./history.controller";
import { HistoryService } from "./history.service";
import { RedisCacheModule } from "../cache/redisCache.module";

@Module({
  controllers: [HistoryController],
  providers: [HistoryService],
  exports: [HistoryService],
  imports: [RedisCacheModule],
})
export class HistoryModule {}
