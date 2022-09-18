import React from "react";
import { io, Socket } from "socket.io-client";
import Peer from "simple-peer";
import create from "zustand";

import { Axios } from "src/services/auth";
import { User } from "src/login";
import { env } from "src/env/client.mjs";

type QuestionDifficulty = "easy" | "medium" | "hard";

export type PoolUser = User & {
  difficulties: QuestionDifficulty[];
};

type Call = {
  from?: User;
  signal?: Peer.SignalData;
};

type SocketStore = {
  socket: Socket | undefined;
  callAccepted: boolean;
  callEnded: boolean;
  stream: MediaStream | undefined;
  name: string;
  call: Call;
  connected: boolean;
  myVideo: React.MutableRefObject<HTMLMediaElement | undefined> | undefined;
  otherVideo: React.MutableRefObject<HTMLMediaElement | undefined> | undefined;
  connectionRef: React.MutableRefObject<Peer.Instance | undefined> | undefined;
  answerCall: () => void;
  callUser: (from: User, id: number) => void;
  leaveCall: () => void;
  sendChat: () => void;
  setupVideo: () => void;
  findMatch: (user: PoolUser) => void;
};

type SocketValues = Omit<
  SocketStore,
  "answerCall" | "callUser" | "leaveCall" | "sendChat"
>;

const SocketMutations = (
  setState: (values: Partial<SocketValues>) => void,
  getState: () => SocketValues
): SocketStore => {
  const socket = io(`${env.NEXT_PUBLIC_WS_URL}/match`, {
    withCredentials: true,
    transports: ["websocket"],
  });
  console.log({ socket });

  socket.on("connect", () => {
<<<<<<< HEAD
    console.log("connected to websocket server :)");
=======
    console.log("connected to websocket server");

    console.log(`${env.NEXT_PUBLIC_WS_URL}/match`);
>>>>>>> feat: tmoved all websockets to redis, tdebugging undefined dep injection
    setState({ connected: true });
  });
  socket.on("disconnect", () => {
    console.log("disconnected from ws server :(");
    setState({ connected: false });
  });
  socket.on("chat", (data) => {
    console.log({ data });
  });
  socket.on("message", (data) => {
    const parsed = JSON.parse(data);
    console.log("message received: ", { parsed });
  });
  socket.on("matched", (data) => {
    const parsedExistingRoom = JSON.parse(data);
    console.log("existing room: ", { parsedExistingRoom });
  });
  socket.on("joined", (data) => {
    const parsedJoinSuccess = JSON.parse(data);
    console.log("successfully joined queue: ", { parsedJoinSuccess });
  });
  socket.on("found", (data) => {
    const parsedMatchedRoom = JSON.parse(data);
    console.log("matched room: ", { parsedMatchedRoom });
  });

  const setupVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setState({ stream });
        if (!getState().myVideo) {
          return;
        } else {
          // set source of media for video element
          getState().myVideo!.current!.srcObject = stream;
        }
      });
  };

  const answerCall = () => {
    setState({ callAccepted: true });
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: getState().stream,
    });
    peer.on("signal", (data) => {
      getState().socket?.emit("answerCall", {
        signal: data,
        to: getState().call.from,
      });
    });
    peer.on("stream", (currentStream) => {
      if (
        !getState() ||
        !getState().otherVideo ||
        !getState().otherVideo?.current
      ) {
        return;
      }
      getState().otherVideo!.current!.srcObject = currentStream;
    });
    peer.signal(getState().call.signal!);
    getState().connectionRef!.current = peer;
  };

  const callUser = (from: User, id: number) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: getState().stream,
    });
    peer.on("signal", (data) => {
      getState().socket?.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: from,
      });
    });
    peer.on("stream", (currentStream) => {
      if (
        !getState().otherVideo ||
        getState().otherVideo === undefined ||
        getState().otherVideo?.current === undefined
      ) {
        return;
      }
      getState().otherVideo!.current!.srcObject = currentStream;
    });
    getState().socket?.on("callAccepted", (signal) => {
      setState({ callAccepted: true });
      peer.signal(signal);
    });
    getState().connectionRef!.current = peer;
  };

  const leaveCall = () => {
    setState({ callEnded: true });
    getState().connectionRef!.current!.destroy();
  };

  const sendChat = () => {
    getState().socket?.emit("chat", { message: "hello to chat from client" });
  };

  const findMatch = (user: PoolUser) => {
<<<<<<< HEAD
    console.log("finding match: ", { user, socketId: getState().socket?.id });
=======
>>>>>>> feat: tmoved all websockets to redis, tdebugging undefined dep injection
    getState().socket?.emit("join", JSON.stringify(user));
  };

  return {
    socket,
    callAccepted: false,
    callEnded: false,
    stream: undefined,
    name: "",
    call: {},
    connected: false,
    myVideo: undefined,
    otherVideo: undefined,
    connectionRef: undefined,
    answerCall,
    callUser,
    leaveCall,
    sendChat,
    setupVideo,
    findMatch,
  };
};

export const useSocketStore = create<SocketStore>(SocketMutations);
