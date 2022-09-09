import { UseGuards } from "@nestjs/common";
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
import { User } from "@prisma/client";

import { CORS_OPTIONS } from "../config";
import { WsJwtAccessGuard } from "../auth/guard/ws.access.guard";
import { PublicUserInfo } from "../utils/zod/userInfo";
import { QuestionDifficulty } from "src/utils/zod/question";
import { v4 } from "uuid";
// import { CurrentUser } from "../utils/decorators/get-current-user.decorator";

type PoolUser = PublicUserInfo & {
  socket: Socket;
  timeJoined: number;
  difficulties: QuestionDifficulty[];
};

// @UseGuards(WsJwtAccessGuard)
@WebSocketGateway({
  cors: CORS_OPTIONS,
})
export class MatchGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  users = 0;
  queueTime = 20000;
  pollInterval = 1000;
  pool: Map<string | number, PoolUser> = new Map<string | number, PoolUser>();

  async handleConnection() {
    console.log("client has connected");
    // A client has connected
    this.users++;
    // Notify connected clients of current users
    this.server.emit("users", this.users);
  }
  async handleDisconnect() {
    console.log("client has disconnected");
    // A client has disconnected
    this.users--;
    // Notify connected clients of current users
    this.server.emit("users", this.users);
  }

  @SubscribeMessage("chat")
  async onChat(client: Socket, message) {
    const msg = message.message;
    // console.log(client.handshake);
    client.broadcast.emit("chat", msg);
    client.emit("chat", msg);
  }

  @SubscribeMessage("pool")
  async onJoinPool(client: Socket, data: PoolUser) {
    console.log({ data });
    const userPoolItem: PoolUser = {
      ...data,
      socket: client,
      timeJoined: Date.now(),
    };
    console.log({ userPoolItem });
    this.pool.set(userPoolItem.id, userPoolItem);

    // //receive player info
    // socket.on("message", (message) => {
    //   const new_item: PoolItem<any> = {
    //     socket: socket,
    //     time_joined: Date.now(),
    //     ...JSON.parse(message.toString()),
    //   };
    //   // add player to pool if they are not already in pool
    //   if (!this.pool.has(new_item.id)) {
    //     this.pool.set(new_item.id, new_item);
    //   } else {
    //     socket.disconnect();
    //   }
    // });
  }

  // matching logic
  isMatch = (user1: PoolUser, user2: PoolUser) => {
    // if user1 and user2 have any common difficulties, return true
    return intersects(user1.difficulties, user2.difficulties);
  };

  returnResults = (a: PoolUser, b: PoolUser, roomId: string) => {
    const aRes = {
      self: a.id,
      otherId: b.id,
      roomId,
    };
    const bRes = {
      self: b.id,
      otherId: a.id,
      roomId,
    };
    return { aRes, bRes };
  };

  // removeSocket = (x: any): any => {
  //   const { socket, ...a } = x;
  //   return a;
  // };
}
