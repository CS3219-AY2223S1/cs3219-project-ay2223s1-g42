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
import { AuthUser as SupabaseAuthUser } from "@supabase/supabase-js";

import { SupabaseGuard } from "../auth/guard/supabase.guard";
import { CurrentUser } from "../utils/decorators/get-current-user.decorator";

@WebSocketGateway({
  cors: {
    origin: "*",
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  users: number = 0;

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
    console.log(client.handshake);
    console.log(client.handshake.headers.cookie);
    client.broadcast.emit("chat", { message: `echoing ${msg}` });
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
