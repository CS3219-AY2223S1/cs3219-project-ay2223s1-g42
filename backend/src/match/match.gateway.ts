import { UseGuards } from "@nestjs/common";
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

import {
  MATCH_WS_NAMESPACE,
  MATCH_EVENTS,
  PoolUserData,
  PoolUser,
  MATCH_MESSAGES,
  PendingRoomUser,
} from "shared/api";
import { CORS_OPTIONS } from "../config";
import { WsJwtAccessGuard } from "../auth/guard/ws.access.guard";
import { MatchService } from "./match.service";

@UseGuards(WsJwtAccessGuard)
@WebSocketGateway({
  cors: CORS_OPTIONS,
  namespace: MATCH_WS_NAMESPACE,
})
export class MatchGateway {
  @WebSocketServer()
  server: Server;

  constructor(private matchService: MatchService) {}

  @SubscribeMessage(MATCH_EVENTS.JOIN_QUEUE)
  async onJoinMatch(client: Socket, data: any) {
    // parse user and add socket id
    const parsed: PoolUserData = JSON.parse(data);
    const poolUser: PoolUser = {
      ...parsed,
      socketId: client.id,
      timeJoined: Date.now(),
    };

    try {
      const existingRoomId = await this.matchService.handleUserAlreadyMatched(
        poolUser
      );

      if (existingRoomId) {
        client.emit(
          MATCH_EVENTS.ROOM_EXISTS,
          JSON.stringify({
            message: MATCH_MESSAGES.ROOM_EXISTS,
            existingRoomId,
          })
        );
        return;
      }

      // find users with matching difficulties
      const matchingUserIds = await this.matchService.handleFindMatchingUserIds(
        poolUser
      );

      // if unable to find any, add to queue
      if (!matchingUserIds || matchingUserIds.length === 0) {
        // use normal try catch since radash tryit causes `this.cache is undefined` error
        await this.matchService.handleJoinMatchQueue(poolUser);
        // emit join queue success
        client.emit(
          MATCH_EVENTS.JOIN_QUEUE_SUCCESS,
          JSON.stringify({ message: MATCH_MESSAGES.JOIN_QUEUE_SUCCESS })
        );
        return;
      }

      // if match found, create room with matched users
      // and disconnect matched users from queue
      const matchedRoom = await this.matchService.handleFoundMatches(
        poolUser,
        matchingUserIds
      );

      // if no error and matched room, emit room data to both users
      const notifyAllUsers = matchedRoom.users.map(
        async (user) =>
          await this.server.to(user.socketId).emit(
            MATCH_EVENTS.MATCH_FOUND,
            JSON.stringify({
              message: MATCH_MESSAGES.MATCH_FOUND,
              matchedRoomId: matchedRoom.id,
            })
          )
      );

      // if error occurred trying to notify users, log it
      await Promise.all(notifyAllUsers);
    } catch (err: any) {
      client.emit(
        MATCH_EVENTS.JOIN_QUEUE_ERROR,
        JSON.stringify({
          message: MATCH_MESSAGES.JOIN_QUEUE_ERROR,
        })
      );
      return;
    }
  }

  @SubscribeMessage(MATCH_EVENTS.LEAVE_QUEUE)
  async onLeaveMatch(client: Socket, data: any) {
    const { id }: { id: number } = JSON.parse(data);

    try {
      // get queue user from user id
      const user = await this.matchService.getQueueUserFromId(id.toString());
      // disconnect user from queue
      await this.matchService.disconnectFromMatchQueue(user);
    } catch (err) {
      // emit error message if user not found in queue
      client.emit(
        MATCH_EVENTS.LEAVE_QUEUE_ERROR,
        JSON.stringify({
          message: MATCH_MESSAGES.LEAVE_QUEUE_ERROR,
        })
      );
      return;
    }

    // emit success if successfully disconnect user from queue
    client.emit(
      MATCH_EVENTS.LEAVE_QUEUE_SUCCESS,
      JSON.stringify({ message: MATCH_MESSAGES.LEAVE_QUEUE_SUCCESS })
    );
  }

  @SubscribeMessage(MATCH_EVENTS.CANCEL_MATCH)
  async onCancelRoom(client: Socket, data: any) {
    const { id: pendingUserId, roomId: pendingUserRoomId }: PendingRoomUser =
      JSON.parse(data);
    try {
      this.matchService.handleCancelMatch(
        client,
        this.server,
        pendingUserId,
        pendingUserRoomId
      );
    } catch (err) {
      console.error(err);
      client.emit(
        MATCH_EVENTS.CANCEL_MATCH_ERR,
        JSON.stringify({ message: MATCH_MESSAGES.CANCEL_MATCH_ERR })
      );
      return;
    }
  }
}
