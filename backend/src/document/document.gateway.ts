import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
} from "@nestjs/websockets";
import { UseGuards } from "@nestjs/common";
import { Server } from "socket.io";
import { Document, YSocketIO } from "y-socket.io/dist/server";

import { CORS_OPTIONS } from "src/config";
import { DocumentService, DOCUMENT_TEXT_NAME } from "./document.service";
import { WsJwtAccessGuard } from "src/auth/guard/ws.access.guard";

@WebSocketGateway({
  cors: CORS_OPTIONS,
})
export class DocumentGateway implements OnGatewayInit {
  @WebSocketServer()
  ySocketIO: YSocketIO;

  constructor(private documentService: DocumentService) {}

  async afterInit(server: Server) {
    // Create the YSocketIO instance
    // NOTE: This uses the socket namespaces that match the regular expression /^\/yjs\|.*$/, make sure that when using namespaces
    //       for other logic, these do not match the regular expression, this could cause unwanted problems.
    // TIP: You can export a new instance from another file to manage as singleton and access documents from all app.
    this.ySocketIO = new YSocketIO(server, {
      authenticate: (auth) => {
        return true;
      },
      // levelPersistenceDir: './storage-location',
      // gcEnabled: true,
    });

    this.ySocketIO.on("document-loaded", async (doc: Document) => {
      const roomId = doc.name;
      try {
        const delta = await this.documentService.getDocumentDeltaFromId(roomId);
        doc.getText(DOCUMENT_TEXT_NAME).applyDelta(delta);
      } catch (err) {
        console.error(
          "error loading document or document does not exist yet: ",
          err
        );
      }
    });

    // this.ySocketIO.on(
    //   "document-update",
    //   async (doc: Document, update: Uint8Array) => {
    //     console.log("document on update");
    //     // await this.documentService.saveRoomDocument(doc.name, doc);
    //   }
    // );
    // this.ySocketIO.on(
    //   "awareness-update",
    //   async (doc: Document, update: Uint8Array) => {
    //     console.log(
    //       `The awareness of the document ${doc.name} is updated with: ${update}`
    //     );
    //     console.log("saving document on update");
    //     await this.documentService.saveRoomDocument(doc.name, doc);
    //   }
    // );

    this.ySocketIO.on("document-destroy", async (doc: Document) => {
      try {
        await this.documentService.deleteDocument(doc.name);
      } catch (err) {
        console.error("error deleting document: ", err);
      }
    });

    this.ySocketIO.on(
      "all-document-connections-closed",
      async (doc: Document) => {
        console.log(`All clients of document ${doc.name} are disconected`);
        await this.documentService.saveRoomDocument(doc.name, doc);
      }
    );

    // Execute initialize method
    this.ySocketIO.initialize();

    // Handling another socket namespace
    // server.on("connection", (socket: Socket) => {
    //   console.log(`[connection] Connected with user: ${socket.id}`);

    //   // You can add another socket logic here...
    //   socket.on("disconnect", () => {
    //     console.log(`[disconnect] Disconnected with user: ${socket.id}`);
    //   });
    // });
  }
}
