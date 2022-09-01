import { Server } from "socket.io";

import { PoolItem, ServerOptions } from "./types";

export class MatchMakingServer {
  io: Server;
  port: number;
  allowedClients: string[] | null;
  disallowedClients: string[] | null;
  queueTime: number;
  pollInterval: number;
  pool: Map<string | number, PoolItem<any>> = new Map<
    string | number,
    PoolItem<any>
  >();
  isMatch: (p1: PoolItem<any>, p2: PoolItem<any>) => boolean;
  resultsCallback?: ((p1: PoolItem<any>, p2: PoolItem<any>) => any) | null;

  constructor(
    port: number,
    isMatch: (p1: PoolItem<any>, p2: PoolItem<any>) => boolean,
    resultsCallback?: ((p1: PoolItem<any>, p2: PoolItem<any>) => any) | null,
    options?: ServerOptions
  ) {
    this.port = port;
    this.allowedClients = options?.allowedClients
      ? options.allowedClients
      : null;
    this.disallowedClients = options?.disallowedClients
      ? options.disallowedClients
      : null;
    this.queueTime = options?.queueTime ? options.queueTime : 20000;
    this.pollInterval = options?.pollInterval ? options.pollInterval : 1000;
    this.io = new Server(!options?.httpServer ? port : options.httpServer);
    this.isMatch = isMatch;
    this.resultsCallback = resultsCallback ? resultsCallback : null;
    this.start();
    setInterval(() => this.match_make(), this.pollInterval);
  }

  start() {
    this.io.on("connection", (socket) => {
      const ip = socket.client.request.socket.remoteAddress
        ? socket.client.request.socket.remoteAddress.slice(7)
        : "";
      console.log("received connection from: " + ip);

      if (!ip || (this.allowedClients && !this.allowedClients?.includes(ip))) {
        console.log(`unauthorised IP: ${ip ? ip : "(no ip)"}`);
        socket.disconnect();
        return;
      }
      if (this.disallowedClients && this.disallowedClients?.includes(ip)) {
        console.log(`unauthorised IP: ${ip}`);
        socket.disconnect();
        return;
      }

      //receive player info
      socket.on("message", (message) => {
        const new_item: PoolItem<any> = {
          socket: socket,
          time_joined: Date.now(),
          ...JSON.parse(message.toString()),
        };
        // add player to pool if they are not already in pool
        if (!this.pool.has(new_item.id)) {
          this.pool.set(new_item.id, new_item);
        } else {
          socket.disconnect();
        }
      });
    });
    console.log(`MatchMaking Server running on port ${this.port}`);
  }

  // matchmakes users within the current pool with each other
  match_make() {
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
            if (!this.resultsCallback) {
              const a_res = remove_socket(a);
              const b_res = remove_socket(b);
              a.socket.send(
                JSON.stringify({ client: { ...a_res }, opponent: { ...b_res } })
              );
              b.socket.send(
                JSON.stringify({ client: { ...b_res }, opponent: { ...a_res } })
              );
            } else {
              const res = this.resultsCallback(a, b);
              a.socket.send(JSON.stringify(res));
              b.socket.send(JSON.stringify(res));
            }
            a.socket.disconnect();
            b.socket.disconnect();
            this.pool.delete(A);
            this.pool.delete(B);
          }
        } else {
          const b = this.pool.get(B);
          if (b && Date.now() - b.time_joined > this.queueTime) {
            console.log(`${b.id} timed out of queue.`);
            b.socket.disconnect();
            this.pool.delete(B);
          }
        }
      }
    }
  }
}

const remove_socket = (x: any): any => {
  const { socket, ...a } = x;
  return a;
};
