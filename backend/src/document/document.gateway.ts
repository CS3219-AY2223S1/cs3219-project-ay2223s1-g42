import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
} from "@nestjs/websockets";
import { Server } from "socket.io";
import { Document, YSocketIO } from "y-socket.io/dist/server";

import { CORS_OPTIONS } from "src/config";
import { DocumentService } from "./document.service";

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
      // authenticate: (auth) => auth.token === 'valid-token',
      // levelPersistenceDir: './storage-location',
      // gcEnabled: true,
    });

    this.ySocketIO.on("document-loaded", async (doc: Document) => {
      const roomId = doc.name;
      const [err, delta] = await this.documentService.getDocumentDeltaFromId(
        roomId
      );
      if (err) {
        console.error("error loading document: ", err);
      }
      doc.getText().applyDelta(delta);
    });

    this.ySocketIO.on(
      "document-update",
      async (doc: Document, update: Uint8Array) => {
        console.log("update: ", { doc, update });
        const [err] = await this.documentService.saveRoomDocument(
          doc.name,
          doc
        );
        if (err) {
          console.error("error saving document: ", err);
        }
      }
    );
    // ysocketio.on('awareness-update', (doc: Document, update: Uint8Array) => console.log(`The awareness of the document ${doc.name} is updated`))
    // ysocketio.on('document-destroy', async (doc: Document) => console.log(`The document ${doc.name} is being destroyed`))
    // ysocketio.on('all-document-connections-closed', async (doc: Document) => console.log(`All clients of document ${doc.name} are disconected`))

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
