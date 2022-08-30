import { Socket } from "socket.io";
// import https from "https";
import http from "http";

export type PoolItem<T> = T & {
  socket: Socket;
  time_joined: number;
};

export type ServerOptions = {
  allowed_clients?: string[] | null;
  disallowed_clients?: string[] | null;
  queue_time?: number;
  poll_interval?: number;
  https_server?: http.Server;
};
