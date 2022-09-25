import { Module } from "@nestjs/common";

import { RedisCacheModule } from "../cache/redisCache.module";
import { RoomServiceModule } from "../room/room.service.module";
import { MatchService } from "./match.service";

@Module({
  imports: [RoomServiceModule, RedisCacheModule],
  providers: [MatchService],
  exports: [MatchService],
})
export class MatchServiceModule {}
