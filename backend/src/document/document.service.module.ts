import { Module } from "@nestjs/common";

import { RedisCacheModule } from "src/cache/redisCache.module";
import { RoomServiceModule } from "src/room/room.service.module";
import { DocumentService } from "./document.service";

@Module({
  imports: [RoomServiceModule, RedisCacheModule],
  providers: [DocumentService],
  exports: [DocumentService],
})
export class DocumentServiceModule {}
