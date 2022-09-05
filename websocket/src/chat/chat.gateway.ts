import { UseGuards } from "@nestjs/common";
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server } from "socket.io";
import { AuthUser as SupabaseAuthUser } from "@supabase/supabase-js";

import { SupabaseGuard } from "src/auth/guard/supabase.guard";
import { CurrentUser } from "src/utils/decorators/get-current-user.decorator";

@WebSocketGateway()
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  @UseGuards(SupabaseGuard)
  @SubscribeMessage("send_message")
  listenForMessages(
    @CurrentUser() user: SupabaseAuthUser,
    @MessageBody() data: string
  ) {
    console.log({ user });
    this.server.sockets.emit("receive_message", data);
  }
}
