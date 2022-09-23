import { UseGuards } from "@nestjs/common";
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { tryit } from "radash";

import { CORS_OPTIONS } from "../config";
import { WsJwtAccessGuard } from "../auth/guard/ws.access.guard";
import { PublicUserInfo } from "../utils/zod/userInfo";
import { QuestionDifficulty } from "src/utils/zod/question";
import { MatchService } from "./match.service";
import { MATCH_EVENTS, MATCH_MESSAGES, MATCH_WS_NAMESPACE } from "./constants";

export type PoolUserData = PublicUserInfo & {
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
export class MatchGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private matchService: MatchService) {}

  async handleConnection() {
    console.log("client has connected");
  }
  async handleDisconnect() {
    console.log("client has disconnected");
  }

  @SubscribeMessage(MATCH_EVENTS.JOIN_QUEUE)
  async onJoinMatch(client: Socket, data: any) {
    // parse user and add socket id
    const parsed: PoolUserData = JSON.parse(data);
    const poolUser: PoolUser = {
      ...parsed,
      socketId: client.id,
      timeJoined: Date.now(),
    };

    console.log("joined user: ", { poolUser });

    // if user already in room, send existing room id to user
    const [existingRoomErr, existingRoom] =
      await this.matchService.handleUserAlreadyMatched(poolUser);
    if (existingRoom || !existingRoomErr) {
      client.emit(
        MATCH_EVENTS.ROOM_EXISTS,
        JSON.stringify({ message: MATCH_MESSAGES.ROOM_EXISTS, existingRoom })
      );
      return;
    }

    // find users with matching difficulties
    const [matchingUsersErr, matchingUsers] = await tryit(
      this.matchService.handleFindMatchingUsers
    )(poolUser);

    // if unable to find any, add to queue
    if (matchingUsersErr || !matchingUsers || matchingUsers.length === 0) {
      const [joinQueueErr] = await tryit(
        this.matchService.handleJoinMatchQueue
      )(poolUser);

      // emit join queue error if error
      if (joinQueueErr) {
        console.log("join queue error: ", joinQueueErr);
        client.emit(
          MATCH_EVENTS.JOIN_QUEUE_ERROR,
          JSON.stringify({
            message: MATCH_MESSAGES.JOIN_QUEUE_ERROR,
            error: joinQueueErr,
          })
        );
        return;
      }

      // emit join queue success
      client.emit(
        MATCH_EVENTS.JOIN_QUEUE_SUCCESS,
        JSON.stringify({ message: MATCH_MESSAGES.JOIN_QUEUE_SUCCESS })
      );
      return;
    }

    // if match found, create room with matched users
    const [matchedRoomErr, matchedRoom] = await tryit(
      this.matchService.handleFoundMatches
    )(poolUser, matchingUsers);

    console.log({ matchedRoom });

    // if no error and matched room, emit room data to both users
    const notifyAllUsers = matchedRoom.users.map(
      async (user) =>
        await this.server.to(user.socketId).emit(
          MATCH_EVENTS.MATCH_FOUND,
          JSON.stringify({
            message: MATCH_MESSAGES.MATCH_FOUND,
            matchedRoom,
          })
        )
    );

    // if error occurred trying to notify users, log it
    const [notifyErr] = await tryit(Promise.all)(notifyAllUsers);
    if (notifyErr) {
      console.log("error notifying users of match: ", notifyErr);
    }
  }

  @SubscribeMessage(MATCH_EVENTS.LEAVE_QUEUE)
  async onLeaveMatch(client: Socket, data: any) {
    const { id }: { id: number } = JSON.parse(data);

    // get queue user from user id
    const [noUserErr, user] = await this.matchService.getQueueUserFromId(
      id.toString()
    );

    // emit error if user not found in queue
    if (noUserErr || !user) {
      client.emit(
        MATCH_EVENTS.LEAVE_QUEUE_ERROR,
        JSON.stringify({
          message: "error occurred, user is not in queue.",
          error: noUserErr,
        })
      );
      return;
    }

    // disconnect user from queue
    const [disconnectErr] = await tryit(
      this.matchService.disconnectFromMatchQueue
    )(user);

    // emit error if failed to disconnect user from queue
    if (disconnectErr) {
      client.emit(
        MATCH_EVENTS.LEAVE_QUEUE_ERROR,
        JSON.stringify({
          message: MATCH_MESSAGES.LEAVE_QUEUE_ERROR,
          error: disconnectErr,
        })
      );
    }

    // emit success if successfully disconnect user from queue
    client.emit(
      MATCH_EVENTS.LEAVE_QUEUE_SUCCESS,
      JSON.stringify({ message: MATCH_MESSAGES.LEAVE_QUEUE_SUCCESS })
    );
  }
}
