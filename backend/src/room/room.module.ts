import { Module } from "@nestjs/common";
import { RedisCacheModule } from "src/cache/redisCache.module";

import { RoomGateway } from "./room.gateway";
import { RoomServiceModule } from "./room.service.module";

@Module({
  imports: [RedisCacheModule, RoomServiceModule],
  providers: [RoomGateway],
})
export class RoomModule {}
