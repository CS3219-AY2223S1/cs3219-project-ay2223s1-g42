import { Module } from "@nestjs/common";

import { RedisCacheModule } from "src/cache/redisCache.module";
import { RoomServiceModule } from "src/room/room.service.module";
import { MatchService } from "./match.service";

@Module({
  imports: [RoomServiceModule, RedisCacheModule],
  providers: [MatchService],
  exports: [MatchService],
})
export class MatchServiceModule {}
