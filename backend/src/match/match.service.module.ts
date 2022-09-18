import { Module } from "@nestjs/common";

import { RedisCacheModule } from "src/cache/redisCache.module";
import { RoomServiceModule } from "src/room/room.service.module";
import { MatchService } from "./match.service";

@Module({
<<<<<<< HEAD
<<<<<<< HEAD
  imports: [RoomServiceModule, RedisCacheModule],
=======
  imports: [RoomServiceModule],
>>>>>>> feat: tmoved all websockets to redis, tdebugging undefined dep injection
=======
  imports: [RoomServiceModule, RedisCacheModule],
>>>>>>> feat: fix dep injection bug with circular dep fix
  providers: [MatchService],
  exports: [MatchService],
})
export class MatchServiceModule {}
