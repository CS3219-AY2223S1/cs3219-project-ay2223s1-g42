import { UseGuards } from "@nestjs/common";
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { tryit } from "radash";

import { CORS_OPTIONS } from "../config";
import { WsJwtAccessGuard } from "../auth/guard/ws.access.guard";
import { ROOM_EVENTS, ROOM_MESSAGES, ROOM_WS_NAMESPACE } from "./constants";
import { RoomService } from "./room.service";
import { PoolUser } from "src/match/match.gateway";

export type Room = {
  id: string;
  users: PoolUser[];
};

export type RoomUser = {
  id: number;
  roomId: string;
};

@UseGuards(WsJwtAccessGuard)
@WebSocketGateway({
  cors: CORS_OPTIONS,
  namespace: ROOM_WS_NAMESPACE,
})
export class RoomGateway {
  @WebSocketServer()
  server: Server;

  constructor(private roomService: RoomService) {}

  @SubscribeMessage(ROOM_EVENTS.JOIN_ROOM)
  async onJoinRoom(client: Socket, data: any) {
    // find room of user
    const roomUser: RoomUser = JSON.parse(data);
    const [roomIdErr, roomId] = await tryit(
      this.roomService.getRoomIdFromUserId
    )(roomUser.id.toString());

    // emit error if room id not found or error occurred
    if (roomIdErr || !roomId) {
      client.emit(ROOM_EVENTS.INVALID_ROOM, {
        message: ROOM_MESSAGES.INVALID_ROOM,
      });
      return;
    }

    // get room data
    const room = await this.roomService.getRoomFromId(roomId);

    // broadcast user has joined to room
    client.join(room.id);
    this.server
      .to(room.id)
      .emit(ROOM_MESSAGES.NEW_USER_JOINED, { room, newUserId: roomUser.id });
  }

  @SubscribeMessage(ROOM_EVENTS.LEAVE_ROOM)
  async onLeaveRoom(client: Socket, data: any) {
    // find room of user
    const roomUser: RoomUser = JSON.parse(data);
    const [roomIdErr, roomId] = await tryit(
      this.roomService.getRoomIdFromUserId
    )(roomUser.id.toString());

    // emit error if room id not found or error occurred
    if (roomIdErr || !roomId) {
      client.emit(ROOM_EVENTS.INVALID_ROOM, {
        message: ROOM_MESSAGES.INVALID_ROOM,
      });
      return;
    }

    // get room data
    const room = await this.roomService.getRoomFromId(roomId);

    // remove user from room
    const [removeErr] = await tryit(this.roomService.removeUserFromRoom)(
      room,
      roomUser.id
    );

    // emit error if error while leaving room
    if (removeErr) {
      client.emit(ROOM_EVENTS.LEAVE_ROOM_ERR, {
        message: ROOM_MESSAGES.LEAVE_ROOM_ERR,
      });
      return;
    }

    // broadcast user has left to room
    client.leave(room.id);
    this.server
      .to(room.id)
      .emit(ROOM_MESSAGES.OLD_USER_LEFT, { room, oldUserId: roomUser.id });
  }
}
