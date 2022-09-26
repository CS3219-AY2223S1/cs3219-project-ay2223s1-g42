import { UseGuards } from "@nestjs/common";
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

import { CORS_OPTIONS } from "../config";
import { WsJwtAccessGuard } from "../auth/guard/ws.access.guard";
import { ROOM_EVENTS, ROOM_MESSAGES, ROOM_WS_NAMESPACE } from "./constants";
import { RoomService } from "./room.service";
import { PoolUser } from "src/match/match.gateway";
import { PublicUserInfo } from "src/utils/zod/userInfo";

export type Room = {
  id: string;
  users: PoolUser[];
};

export type RoomUser = Required<PublicUserInfo> & {
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
    const roomUser: RoomUser = JSON.parse(data);
    console.log("received JOIN_ROOM event: ", { roomUser });
    try {
      // find room of user
      const roomId = await this.roomService.getRoomIdFromUserId(
        roomUser.id.toString()
      );

      console.log("user joined room: ", { roomUser, roomId });

      // emit error if room id not found or error occurred
      if (!roomId || roomUser.roomId !== roomId) {
        client.emit(
          ROOM_EVENTS.INVALID_ROOM,
          JSON.stringify({
            message: ROOM_MESSAGES.INVALID_ROOM,
          })
        );
        return;
      }

      // get room data
      const room = await this.roomService.getRoomFromId(roomId);

      // get user info
      const { roomId: _, ...userData } = roomUser;

      // broadcast user has joined to room
      client.emit(ROOM_EVENTS.JOIN_ROOM_SUCCESS, JSON.stringify({ room }));
      this.server
        .to(room.id)
        .emit(
          ROOM_EVENTS.NEW_USER_JOINED,
          JSON.stringify({ room, newUser: userData })
        );
      await client.join(room.id);
    } catch (err) {
      console.error(err);
      client.emit(
        ROOM_EVENTS.JOIN_ROOM_ERROR,
        JSON.stringify({
          message: ROOM_MESSAGES.JOIN_ROOM_ERROR,
        })
      );
      return;
    }
  }

  @SubscribeMessage(ROOM_EVENTS.LEAVE_ROOM)
  async onLeaveRoom(client: Socket, data: any) {
    try {
      // find room of user
      const roomUser: RoomUser = JSON.parse(data);
      const roomId = await this.roomService.getRoomIdFromUserId(
        roomUser.id.toString()
      );

      // emit error if room id not found or error occurred
      if (!roomId || roomUser.roomId !== roomId) {
        client.emit(
          ROOM_EVENTS.INVALID_ROOM,
          JSON.stringify({
            message: ROOM_MESSAGES.INVALID_ROOM,
          })
        );
        return;
      }

      // get room data
      const currentRoom = await this.roomService.getRoomFromId(roomId);
      console.log("removing user from room: ", { roomUser, currentRoom });

      // remove user from room
      const room = await this.roomService.removeUserFromRoom(
        currentRoom,
        roomUser.id
      );

      // remove user as room user
      await this.roomService.removeUserAsRoomUser(roomUser.id.toString());

      // remove user from room and notify user has left room
      console.log({ currentRoomId: currentRoom.id, roomId: room.id });
      await client.leave(room.id);
      client.emit(
        ROOM_EVENTS.LEAVE_ROOM_SUCCESS,
        JSON.stringify({ message: ROOM_MESSAGES.LEAVE_ROOM_SUCCESS })
      );

      // if room not empty, notify other users that user has left room
      if (room.users.length > 0) {
        this.server
          .to(room.id)
          .emit(
            ROOM_EVENTS.OLD_USER_LEFT,
            JSON.stringify({ room, oldUser: roomUser })
          );
        return;
      }

      // if room empty, delete room
      await this.roomService.deleteRoom(room.id);
    } catch (err) {
      console.error(err);
      client.emit(
        ROOM_EVENTS.LEAVE_ROOM_ERR,
        JSON.stringify({
          message: ROOM_MESSAGES.LEAVE_ROOM_ERR,
        })
      );
      return;
    }
  }
}
