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

@UseGuards(WsJwtAccessGuard)
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
  async onJoinPool(client: Socket, data: any) {
    const parsed = JSON.parse(data);
    const randomId = `${parsed.id}${Math.random() * 10}`;
    if (!this.pool.has(randomId)) {
      const poolUser: PoolUser = {
        ...parsed,
        id: randomId,
        socket: client,
        timeJoined: Date.now(),
      };
      console.log("new user joined: ", { poolUser });
      this.pool.set(poolUser.id, poolUser);
    } else {
      console.log("user already in pool, disconnecting...");
      client.disconnect();
    }
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

  // matchmakes users within the current pool with each other every 5s
  @Cron(CronExpression.EVERY_5_SECONDS)
  matchMake() {
    if (this.pool.size < 1) {
      return;
    }
    for (const [A, p1] of this.pool) {
      for (const [B, p2] of this.pool) {
        if (p1.id !== p2.id && this.isMatch(p1, p2)) {
          const a = this.pool.get(A);
          const b = this.pool.get(B);
          if (a && b) {
            console.log(`MATCH FOUND: ${a.id} vs ${b.id}`);
            const roomId = v4();
            const { aRes, bRes } = this.returnResults(a, b, roomId);
            a.socket.send(JSON.stringify(aRes));
            b.socket.send(JSON.stringify(bRes));

            a.socket.disconnect();
            b.socket.disconnect();
            this.pool.delete(A);
            this.pool.delete(B);
          }
        } else {
          const b = this.pool.get(B);
          if (b && Date.now() - b.timeJoined > this.queueTime) {
            console.log(`${b.id} timed out of queue.`);
            b.socket.disconnect();
            this.pool.delete(B);
          }
        }
      }
    }
  }

  // removeSocket = (x: any): any => {
  //   const { socket, ...a } = x;
  //   return a;
  // };
}
