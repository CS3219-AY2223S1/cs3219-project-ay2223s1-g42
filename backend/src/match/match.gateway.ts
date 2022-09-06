import { UseGuards } from "@nestjs/common";
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

import { CORS_OPTIONS } from "../config/constants";
import { WsJwtAccessGuard } from "../auth/guard/ws.access.guard";

// import { CurrentUser } from "../utils/decorators/get-current-user.decorator";

@UseGuards(WsJwtAccessGuard)
@WebSocketGateway({
  cors: CORS_OPTIONS,
})
export class MatchGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  users = 0;

  async handleConnection() {
    // A client has connected
    this.users++;
    // Notify connected clients of current users
    this.server.emit("users", this.users);
  }
  async handleDisconnect() {
    // A client has disconnected
    this.users--;
    // Notify connected clients of current users
    this.server.emit("users", this.users);
  }

  @SubscribeMessage("chat")
  async onChat(client: Socket, message) {
    const msg = message.message;
    // console.log(client.handshake);
    client.broadcast.emit("chat", msg);
    client.emit("chat", msg);
  }

  //   @UseGuards(SupabaseGuard)
  //   @SubscribeMessage("chat")
  //   listenForMessages(
  //     @CurrentUser() user: SupabaseAuthUser,
  //     @MessageBody() data: string
  //   ) {
  //     console.log({ user });
  //     this.server.sockets.emit("receive_message", data);
  //   }
}
