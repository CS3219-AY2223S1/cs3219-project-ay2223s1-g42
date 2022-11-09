import { UseGuards } from "@nestjs/common";
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

import {
  ROOM_WS_NAMESPACE,
  ROOM_EVENTS,
  ROOM_MESSAGES,
  PendingRoomUser,
  RoomUser,
} from "shared/api";
import { CORS_OPTIONS } from "../config";
import { WsJwtAccessGuard } from "../auth/guard/ws.access.guard";
import { RoomService } from "./room.service";

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
    const { id: pendingUserId, roomId: pendingRoomId }: PendingRoomUser =
      JSON.parse(data);

    try {
      // find room of user
      const roomId = await this.roomService.getRoomIdFromUserId(
        pendingUserId.toString()
      );

      // get room data
      const room = await this.roomService.getRoomFromId(roomId);

      // get user info
      const roomUser = room.users.find((user) => user.id === pendingUserId);

      // emit error if room id not found, room id doesnt
      // provided room id or user not found in room
      if (!roomId || pendingRoomId !== roomId || !roomUser) {
        client.emit(
          ROOM_EVENTS.INVALID_ROOM,
          JSON.stringify({
            message: ROOM_MESSAGES.INVALID_ROOM,
          })
        );
        return;
      }

      const otherRoomUser = room.users.find(
        (user) => user.id !== pendingUserId
      );
      const userIsCaller = otherRoomUser.connected;

      const updatedRoomUser: RoomUser = {
        ...roomUser,
        connected: true,
      };

      // add user to room
      const updatedRoom = await this.roomService.addUserToRoom(
        room,
        updatedRoomUser
      );

      // broadcast user has joined to room
      client.emit(
        ROOM_EVENTS.JOIN_ROOM_SUCCESS,
        JSON.stringify({ room: updatedRoom, isCaller: userIsCaller })
      );
      this.server
        .to(room.id)
        .emit(
          ROOM_EVENTS.NEW_USER_JOINED,
          JSON.stringify({ room: updatedRoom, newUser: roomUser })
        );
      // add user to room socket channel AFTER broadcast
      await client.join([room.id, updatedRoomUser.socketId]);
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
      const { id: pendingUserId, roomId: pendingUserRoomId }: PendingRoomUser =
        JSON.parse(data);
      const roomId = await this.roomService.getRoomIdFromUserId(
        pendingUserId.toString()
      );

      // get room data
      const currentRoom = await this.roomService.getRoomFromId(roomId);
      const pendingUserData = currentRoom.users.find(
        (user) => user.id === pendingUserId
      );

      // emit error if room id not found or error occurred
      if (!roomId || pendingUserRoomId !== roomId || !pendingUserData) {
        client.emit(
          ROOM_EVENTS.INVALID_ROOM,
          JSON.stringify({
            message: ROOM_MESSAGES.INVALID_ROOM,
          })
        );
        return;
      }

      // remove user from room
      const room = await this.roomService.removeUserFromRoom(
        currentRoom,
        pendingUserId
      );

      await client.leave(room.id);
      client.emit(
        ROOM_EVENTS.LEAVE_ROOM_SUCCESS,
        JSON.stringify({ message: ROOM_MESSAGES.LEAVE_ROOM_SUCCESS })
      );

      // if room not empty, notify other users that user has left room
      if (room.users.length > 0) {
        const { id, username, email } = pendingUserData;
        this.server
          .to(room.id)
          .emit(
            ROOM_EVENTS.OLD_USER_LEFT,
            JSON.stringify({ room, oldUser: { id, username, email } })
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

  @SubscribeMessage(ROOM_EVENTS.CALL_USER)
  async callUser(client: Socket, data: any) {
    const {
      userToCall,
      signalData,
      from,
    }: { userToCall: string; signalData: any; from: RoomUser } =
      JSON.parse(data);

    this.server
      .to(userToCall)
      .emit(
        ROOM_EVENTS.CALL_USER,
        JSON.stringify({ signal: signalData, from })
      );
  }

  @SubscribeMessage(ROOM_EVENTS.ANSWER_CALL)
  async answerCall(client: Socket, data: any) {
    const { to, signal }: { to: RoomUser; signal: any } = JSON.parse(data);
    this.server
      .to(to.socketId)
      .emit(ROOM_EVENTS.CALL_ACCEPTED, JSON.stringify({ signal }));
  }

  @SubscribeMessage(ROOM_EVENTS.END_CALL)
  async endCall(client: Socket, data: any) {
    const { roomId }: { roomId: string } = JSON.parse(data);
    this.server.to(roomId).emit(ROOM_EVENTS.CALL_ENDED);
  }
}
