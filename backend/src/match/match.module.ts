import { Module } from "@nestjs/common";

import { RedisCacheModule } from "src/cache/redisCache.module";
import { RoomServiceModule } from "src/room/room.service.module";
import { MatchGateway } from "./match.gateway";
import { MatchServiceModule } from "./match.service.module";

@Module({
  imports: [MatchServiceModule],
  providers: [MatchGateway],
})
export class MatchModule {}
