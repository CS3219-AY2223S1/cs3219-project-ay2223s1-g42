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
import { PublicUserInfo } from "../utils/zod/userInfo";
import { QuestionDifficulty } from "src/utils/zod/question";
import { MatchService } from "./match.service";
import {
  MATCH_ERRORS,
  MATCH_EVENTS,
  MATCH_MESSAGES,
  MATCH_WS_NAMESPACE,
} from "./constants";

export type PoolUserData = Required<PublicUserInfo> & {
  difficulties: QuestionDifficulty[];
};

export type PoolUser = PoolUserData & {
  socketId: string;
  timeJoined: number;
};

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

    console.log("joined queue: ", { poolUser });

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
      const matchedRoom = await this.matchService.handleFoundMatches(
        poolUser,
        matchingUserIds
      );

      console.log({ matchedRoom });

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

      console.log("left queue: ", { user });
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
}
