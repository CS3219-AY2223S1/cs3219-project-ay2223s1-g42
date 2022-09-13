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
<<<<<<< HEAD
  async onJoinPool(client: Socket, data: any) {
    const parsed = JSON.parse(data);
    console.log("received data in pool handler: ", { parsed });

    if (!this.pool.has(data.id)) {
      const poolUser: PoolUser = {
        ...parsed,
        socket: client,
        timeJoined: Date.now(),
      };
      console.log("new user joined: ", { poolUser });
      this.pool.set(poolUser.id, poolUser);
    } else {
      client.disconnect();
    }
  }

  // matching logic
  isMatch = (user1: PoolUser, user2: PoolUser) => {
=======
  async onJoinPool(client: Socket, data: PoolUser) {
    console.log({ data });
    const userPoolItem = { ...data, socket: client, timeJoined: Date.now() };
    console.log({ userPoolItem });
    this.pool.set(data.id, userPoolItem);
  }

  // matching logic
  isMatch = (user1: PoolItem<PoolUser>, user2: PoolItem<PoolUser>) => {
>>>>>>> chore: fix rebase pull conflicts
    // if user1 and user2 have any common difficulties, return true
    return intersects(user1.difficulties, user2.difficulties);
  };

<<<<<<< HEAD
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
=======
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
>>>>>>> chore: fix rebase pull conflicts
          const b = this.pool.get(B);
          if (b && Date.now() - b.timeJoined > this.queueTime) {
            console.log(`${b.id} timed out of queue.`);
            b.socket.disconnect();
            this.pool.delete(B);
          }
<<<<<<< HEAD
=======
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
>>>>>>> chore: fix rebase pull conflicts
        }
      }
    }
  }

<<<<<<< HEAD
  // removeSocket = (x: any): any => {
  //   const { socket, ...a } = x;
  //   return a;
  // };
=======
  removeSocket = (x: any): any => {
    const { socket, ...a } = x;
    return a;
  };
>>>>>>> chore: fix rebase pull conflicts
}
