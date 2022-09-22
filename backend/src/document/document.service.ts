import { Injectable } from "@nestjs/common";
import { tryit } from "radash";

import { NAMESPACES } from "src/cache/constants";
import { RedisCacheService } from "src/cache/redisCache.service";
import { Document } from "y-socket.io/dist/server";

@Injectable()
export class DocumentService {
  constructor(private cache: RedisCacheService) {}

  async getDocumentDeltaFromId(id: string) {
    const res = await tryit(this.cache.getKeyInNamespace<any>)(
      [NAMESPACES.DOCUMENT],
      id
    );
    return res;
  }

  async saveRoomDocument(roomId: string, document: Document) {
    const rawDelta = document.getText().toDelta();
    const res = await tryit(this.cache.setKeyInNamespace)(
      [NAMESPACES.DOCUMENT],
      roomId,
      rawDelta
    );
    return res;
  }

  async deleteDocument(id: string) {
    const res = await tryit(this.cache.deleteKeyInNamespace)(
      [NAMESPACES.DOCUMENT],
      id
    );
    return res;
  }
}
