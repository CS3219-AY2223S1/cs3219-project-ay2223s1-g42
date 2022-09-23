import { Injectable } from "@nestjs/common";
import { tryit } from "radash";
import { Document } from "y-socket.io/dist/server";

import { NAMESPACES } from "src/cache/constants";
import { RedisCacheService } from "src/cache/redisCache.service";

export const DOCUMENT_TEXT_NAME = "monaco";

@Injectable()
export class DocumentService {
  constructor(private cache: RedisCacheService) {}

  async getDocumentDeltaFromId(id: string): Promise<[Error, any]> {
    const [err, rawStringifyDelta] = await tryit(
      this.cache.getKeyInNamespace<any>
    )([NAMESPACES.DOCUMENT], id);
    const jsonDelta = JSON.parse(rawStringifyDelta);
    return [err, jsonDelta];
  }

  async saveRoomDocument(roomId: string, document: Document) {
    const rawDelta = document.getText(DOCUMENT_TEXT_NAME).toDelta();
    const rawStringifyDelta = JSON.stringify(rawDelta);
    const res = await tryit(this.cache.setKeyInNamespace)(
      [NAMESPACES.DOCUMENT],
      roomId,
      rawStringifyDelta
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
