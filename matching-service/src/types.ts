import { Socket } from "socket.io";
// import https from "https";
import http from "http";

export type PoolItem<T> = T & {
  socket: Socket;
  timeJoined: number;
};

export type ServerOptions = {
  allowedClients?: string[] | null;
  disallowedClients?: string[] | null;
  queueTime?: number;
  pollInterval?: number;
  httpServer?: http.Server;
};
