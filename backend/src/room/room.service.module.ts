import { Module } from "@nestjs/common";

import { RedisCacheModule } from "../cache/redisCache.module";
import { RoomService } from "./room.service";

@Module({
  imports: [RedisCacheModule],
  providers: [RoomService],
  exports: [RoomService],
})
export class RoomServiceModule {}
