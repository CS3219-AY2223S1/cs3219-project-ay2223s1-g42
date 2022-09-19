import { io } from "socket.io-client";

export class MatchMakingClient {
  serverIp: string;
  callback: (...args: any[]) => any;

  constructor(_serverIp: string, _callback: (...args: any[]) => any) {
    this.serverIp = _serverIp;
    this.callback = _callback;
  }

  match({ ...args }) {
    const socket = io(this.serverIp);

    // runs on connection to server
    socket.on("connect", () => {
      if (!args.id) {
        throw new Error(
          `All objects sent to matchmaking must have the same interface and have an 'id' property`
        );
      }
      const data = JSON.stringify(args);
      socket.emit("pool", data);
      // socket.send(JSON.stringify(args));
    });

    socket.on("connect", () => {
      console.log("connected to websocket server");
    });

    socket.on("chat", (data) => {
      console.log({ data });
    });

    // runs when connection error occurs
    socket.on("connect_error", (err) => {
      console.error(err);
    });

    // runs when message/data is received from server
    socket.on("message", (m) => {
      try {
        this.callback(JSON.parse(m as string));
      } catch (e) {
        console.error(e);
      }
    });

    // runs when connection is closed
    socket.on("disconnect", (reason, desc) => {
      console.log({ reason, desc });
    });
  }
}
