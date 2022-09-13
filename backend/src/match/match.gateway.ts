import { Injectable, UseGuards } from "@nestjs/common";
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Cron, CronExpression } from "@nestjs/schedule";
import { Server, Socket } from "socket.io";
import { intersects } from "radash";

import { CORS_OPTIONS } from "../config";
import { WsJwtAccessGuard } from "../auth/guard/ws.access.guard";
import { PublicUserInfo } from "../utils/zod/userInfo";
import { QuestionDifficulty } from "src/utils/zod/question";
import { MatchService } from "./match.service";
import { MATCH_MESSAGES, MATCH_WS_NAMESPACE } from "./constants";
// import { CurrentUser } from "../utils/decorators/get-current-user.decorator";

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

  @SubscribeMessage(MATCH_MESSAGES.JOIN_QUEUE)
  async onJoinMatch(client: Socket, data: any) {
    // parse user and add socket id
    const parsed: PoolUserData = JSON.parse(data);
    const randomId = parseInt(`${parsed.id}${Math.random() * 10}`);
    const poolUser: PoolUser = {
      ...parsed,
      id: randomId,
      socketId: client.id,
      timeJoined: Date.now(),
    };

    console.log("joined: ", { poolUser });

    // if user already in room, send existing room id to user
    const existingRoom = await this.matchService.handleUserAlreadyMatched(
      poolUser
    );
    console.log("esisting room", { existingRoom });
    if (existingRoom) {
      client.emit(MATCH_MESSAGES.ROOM_EXISTS, existingRoom);
      return;
    }
    
    // try to match user with another user from queue,
    // create room if successful otherwise add user to queue
    const matchedRoom = await this.matchService.handleJoinMatchQueue(poolUser);
    if (!matchedRoom) {
      console.log("user added to pool...");
      client.emit(
        MATCH_MESSAGES.JOIN_QUEUE_SUCCESS,
        JSON.stringify({ message: "success" })
      );
      return;
    }

    console.log({ matchedRoom });

    // emit MATCH_FOUND to all matched users
    const notifyAllUsers = matchedRoom.users.map(
      async (user) =>
        await this.server
          .to(user.socketId)
          .emit(MATCH_MESSAGES.MATCH_FOUND, JSON.stringify(matchedRoom))
    );
    await Promise.all(notifyAllUsers);
  }
}
