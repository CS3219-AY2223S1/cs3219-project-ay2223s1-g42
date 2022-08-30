import { Server } from "socket.io";

import { PoolItem, ServerOptions } from "./types";

export class MatchMakingServer {
  io: Server;
  port: number;
  allowed_clients: string[] | null;
  disallowed_clients: string[] | null;
  queue_time: number;
  poll_interval: number;
  pool: Map<string | number, PoolItem<any>> = new Map<
    string | number,
    PoolItem<any>
  >();
  is_match: (p1: PoolItem<any>, p2: PoolItem<any>) => boolean;
  results_func?: ((p1: PoolItem<any>, p2: PoolItem<any>) => any) | null;

  constructor(
    _port: number,
    _is_match: (p1: PoolItem<any>, p2: PoolItem<any>) => boolean,
    _results_func?: ((p1: PoolItem<any>, p2: PoolItem<any>) => any) | null,
    _options?: ServerOptions
  ) {
    this.port = _port;
    this.allowed_clients = _options?.allowed_clients
      ? _options.allowed_clients
      : null;
    this.disallowed_clients = _options?.disallowed_clients
      ? _options.disallowed_clients
      : null;
    this.queue_time = _options?.queue_time ? _options.queue_time : 20000;
    this.poll_interval = _options?.poll_interval
      ? _options.poll_interval
      : 1000;
    this.io = new Server(
      !_options?.https_server ? _port : _options.https_server
    );
    this.is_match = _is_match;
    this.results_func = _results_func ? _results_func : null;
    this.start();
    setInterval(() => this.match_make(), this.poll_interval);
  }

  start() {
    this.io.on("connection", (socket) => {
      const ip = socket.client.request.socket.remoteAddress
        ? socket.client.request.socket.remoteAddress.slice(7)
        : "";
      console.log("received connection from: " + ip);

      if (
        !ip ||
        (this.allowed_clients && !this.allowed_clients?.includes(ip))
      ) {
        console.log(`unauthorised IP: ${ip ? ip : "(no ip)"}`);
        socket.disconnect();
        return;
      }
      if (this.disallowed_clients && this.disallowed_clients?.includes(ip)) {
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

  match_make() {
    if (this.pool.size < 1) {
      return;
    }
    for (const [A, p1] of this.pool) {
      for (const [B, p2] of this.pool) {
        if (p1.id !== p2.id && this.is_match(p1, p2)) {
          const a = this.pool.get(A);
          const b = this.pool.get(B);
          if (a && b) {
            console.log(`MATCH FOUND: ${a.id} vs ${b.id}`);
            if (!this.results_func) {
              const a_res = remove_socket(a);
              const b_res = remove_socket(b);
              a.socket.send(
                JSON.stringify({ client: { ...a_res }, opponent: { ...b_res } })
              );
              b.socket.send(
                JSON.stringify({ client: { ...b_res }, opponent: { ...a_res } })
              );
            } else {
              const res = this.results_func(a, b);
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
          if (b && Date.now() - b.time_joined > this.queue_time) {
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
