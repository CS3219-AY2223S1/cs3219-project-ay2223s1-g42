import { UseGuards } from "@nestjs/common";
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

import { CORS_OPTIONS } from "../config";
import { WsJwtAccessGuard } from "../auth/guard/ws.access.guard";
import { ROOM_MESSAGES, ROOM_WS_NAMESPACE } from "./constants";
import { RoomService } from "./room.service";
import { PoolUser } from "src/match/match.gateway";

export type Room = {
  users: PoolUser[];
  id: string;
};

@UseGuards(WsJwtAccessGuard)
@WebSocketGateway({
  cors: CORS_OPTIONS,
  namespace: ROOM_WS_NAMESPACE,
})
export class RoomGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  async handleConnection() {
    console.log("client has connected to room");
  }
  async handleDisconnect() {
    console.log("client has disconnected from room");
  }

  //   @SubscribeMessage("join")
  //   async onJoinRoom(client: Socket, data: any) {}
}
