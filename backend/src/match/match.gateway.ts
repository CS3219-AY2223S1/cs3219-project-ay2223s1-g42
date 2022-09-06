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

import { JwtAccessGuard } from "../auth/guard";

// import { CurrentUser } from "../utils/decorators/get-current-user.decorator";

@UseGuards(JwtAccessGuard)
@WebSocketGateway({
  cors: {
    origin: "*",
  },
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
    // return { message: `echoing ${msg}` };
    console.log(client.handshake.headers);
    client.broadcast.emit("chat", msg);
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
