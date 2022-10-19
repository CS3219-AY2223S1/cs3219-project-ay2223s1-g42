import { Injectable } from "@nestjs/common";
import { Document } from "y-socket.io/dist/server";

import { NAMESPACES } from "shared/api";
import { RedisCacheService } from "src/cache/redisCache.service";

export const DOCUMENT_TEXT_NAME = "monaco";

@Injectable()
export class DocumentService {
  constructor(private cache: RedisCacheService) {}

  async getDocumentDeltaFromId(id: string): Promise<[Error, any]> {
    const rawStringifyDelta = await this.cache.getKeyInNamespace<any>(
      [NAMESPACES.DOCUMENT],
      id
    );
    const jsonDelta = JSON.parse(rawStringifyDelta);
    return jsonDelta;
  }

  async saveRoomDocument(roomId: string, document: Document) {
    const rawDelta = document.getText(DOCUMENT_TEXT_NAME).toDelta();
    const rawStringifyDelta = JSON.stringify(rawDelta);
    try {
      await this.cache.setKeyInNamespace(
        [NAMESPACES.DOCUMENT],
        roomId,
        rawStringifyDelta
      );
    } catch (err) {
      console.error(err);
    }
  }

  async deleteDocument(id: string) {
    await this.cache.deleteKeyInNamespace([NAMESPACES.DOCUMENT], id);
  }
}
