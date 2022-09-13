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
import { User } from "@prisma/client";

enum QuizDifficulty {
  EASY = "easy",
  MEDIUM = "medium",
  HARD = "hard",
}

type PoolUser = User & {
  difficulties: QuizDifficulty[];
};

export type PoolItem<T> = T & {
  socket: Socket;
  timeJoined: number;
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
  pool: Map<string | number, PoolItem<PoolUser>> = new Map<
    string | number,
    PoolItem<PoolUser>
  >();

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
    const userPoolItem = { ...data, socket: client, timeJoined: Date.now() };
    console.log({ userPoolItem });
    this.pool.set(data.id, userPoolItem);
  }

  // matching logic
  isMatch = (user1: PoolItem<PoolUser>, user2: PoolItem<PoolUser>) => {
    // if user1 and user2 have any common difficulties, return true
    return intersects(user1.difficulties, user2.difficulties);
  };

  // matchmakes users within the current pool with each other every 5s
  @Cron(CronExpression.EVERY_5_SECONDS)
  matchMake() {
    // if pool is empty, return
    if (this.pool.size < 1) {
      return;
    }

    for (const [A, p1] of this.pool) {
      for (const [B, p2] of this.pool) {
        // if only single user in pool or no compatible match found,
        // disconnect users that have been in pool for too long
        if (p1.id === p2.id || !this.isMatch(p1, p2)) {
          const b = this.pool.get(B);
          if (b && Date.now() - b.timeJoined > this.queueTime) {
            console.log(`${b.id} timed out of queue.`);
            b.socket.disconnect();
            this.pool.delete(B);
          }
          return;
        }
        // if match found, return other user data to both users
        // WITHOUT their socket datas (might need to include)
        const a = this.pool.get(A);
        const b = this.pool.get(B);
        if (a && b) {
          console.log(`MATCH FOUND: ${a.id} vs ${b.id}`);
          a.socket.send(JSON.stringify({ client: a, opponent: b }));
          b.socket.send(JSON.stringify({ client: b, opponent: a }));
          a.socket.disconnect();
          b.socket.disconnect();
          this.pool.delete(A);
          this.pool.delete(B);
        }
      }
    }
  }

  removeSocket = (x: any): any => {
    const { socket, ...a } = x;
    return a;
  };
}
