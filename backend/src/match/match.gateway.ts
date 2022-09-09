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
import { PublicUserInfo } from "../utils/zod";

enum QuizDifficulty {
  EASY = "easy",
  MEDIUM = "medium",
  HARD = "hard",
}

export type PoolUser = Pick<User, "id" | "email" | "username"> & {
  difficulties: QuizDifficulty[];
};

export type PoolItem<T> = T & {
  socket: Socket;
  timeJoined: number;
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
  // pool: Map<string | number, PoolItem<PoolUser>> = new Map<
  //   string | number,
  //   PoolItem<PoolUser>
  // >();
  pool: PoolItem<PoolUser>[] = [];

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
    console.log({ data });
    const userPoolItem: PoolItem<PoolUser> = {
      ...data,
      socket: client,
      timeJoined: Date.now(),
    };
    console.log({ userPoolItem });
    this.pool.push(userPoolItem);

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
  isMatch = (user1: PoolItem<PoolUser>, user2: PoolItem<PoolUser>) => {
    // if user1 and user2 have any common difficulties, return true
    return intersects(user1.difficulties, user2.difficulties);
  };

  // matchmakes users within the current pool with each other every 5s
  @Cron(CronExpression.EVERY_5_SECONDS)
  matchMake() {
    console.log(`running matchmake on ${this.pool.length}`);

    // if pool is empty, return
    if (this.pool.length < 1) {
      return;
    }

    for (const p1 of this.pool) {
      for (const p2 of this.pool) {
        // if only single user in pool or no compatible match found,
        // disconnect users that have been in pool for too long
        // if (p1.id === p2.id || !this.isMatch(p1, p2)) {
        if (!this.isMatch(p1, p2)) {
          // const b = this.pool.get(B);
          const b = p2;
          if (b && Date.now() - b.timeJoined > this.queueTime) {
            console.log(`${b.id} timed out of queue.`);
            b.socket.disconnect();
            // this.pool.delete(B);
            this.pool.filter((p) => p.id !== b.id);
          }
          return;
        }
        // if match found, return other user data to both users
        // WITHOUT their socket datas (might need to include)
        // const a = this.pool.get(A);
        // const b = this.pool.get(B);
        const a = p1;
        const b = p2;
        if (a && b) {
          console.log(`MATCH FOUND: ${a.id} vs ${b.id}`);
          const dataForA = {
            opponent: {
              id: b.id,
              email: b.email,
              username: b.email,
              socket: b.socket.id,
            },
          };
          const dataForB = {
            opponent: {
              id: a.id,
              email: a.email,
              username: a.email,
              socketId: a.socket.id,
            },
          };
          console.log({ dataForA, dataForB });
          a.socket.send(dataForA);
          b.socket.send(dataForB);
          a.socket.disconnect();
          b.socket.disconnect();
          // this.pool.delete(A);
          // this.pool.delete(B);
          this.pool.pop();
          this.pool.pop();
        }
      }
    }
  }

  removeSocket = (x: any): any => {
    const { socket, ...a } = x;
    return a;
  };
}
