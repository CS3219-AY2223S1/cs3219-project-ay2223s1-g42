import { Module } from "@nestjs/common";

import { RedisCacheModule } from "src/cache/redisCache.module";
import { RoomServiceModule } from "src/room/room.service.module";
import { MatchService } from "./match.service";

@Module({
<<<<<<< HEAD
  imports: [RoomServiceModule, RedisCacheModule],
=======
  imports: [RoomServiceModule],
>>>>>>> feat: tmoved all websockets to redis, tdebugging undefined dep injection
  providers: [MatchService],
  exports: [MatchService],
})
export class MatchServiceModule {}
