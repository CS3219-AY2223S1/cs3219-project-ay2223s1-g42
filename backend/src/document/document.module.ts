import { Module } from "@nestjs/common";

import { RedisCacheModule } from "src/cache/redisCache.module";
import { RoomServiceModule } from "src/room/room.service.module";
import { DocumentGateway } from "./document.gateway";
import { DocumentServiceModule } from "./document.service.module";

@Module({
  imports: [DocumentServiceModule, RedisCacheModule, RoomServiceModule],
  providers: [DocumentGateway],
})
export class DocumentModule {}
