import React from "react";
import { io, Socket } from "socket.io-client";
import Peer from "simple-peer";
import create from "zustand";

import { User } from "src/login";

type QuestionDifficulty = "easy" | "medium" | "hard";

export type PoolUser = User & {
  difficulties: QuestionDifficulty[];
};

export type RoomUser = PoolUser & {
  socketId: string;
  timeJoined: Date;
};

type Call = {
  from?: User;
  signal?: Peer.SignalData;
};

type Room = {
  id: string;
  users: RoomUser[];
  difficulty?: QuestionDifficulty;
};

enum MATCH_EVENTS {
  JOIN_QUEUE = "join",
  JOIN_QUEUE_SUCCESS = "join-success",
  JOIN_QUEUE_ERROR = "join-failed",
  LEAVE_QUEUE = "leave",
  LEAVE_QUEUE_SUCCESS = "leave-success",
  LEAVE_QUEUE_ERROR = "leave-error",
  MATCH_FOUND = "found",
  ROOM_EXISTS = "matched",
}

type SocketStore = {
  isInQueue: boolean;
  room: Room | undefined;
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
  setupVideo: () => void;
  joinQueue: (user: PoolUser) => void;
  leaveQueue: (id: number) => void;
};

type SocketValues = Omit<
  SocketStore,
  "answerCall" | "callUser" | "leaveCall" | "sendChat"
>;

const SocketStoreValues = (
  setState: (values: Partial<SocketValues>) => void,
  getState: () => SocketValues
): SocketStore => {
  const socket = io(`${import.meta.env.VITE_API_URL}/match`, {
    withCredentials: true,
    transports: ["websocket"],
    autoConnect: false,
  });

  socket.on("connect", () => {
    console.log("connected to websocket server :)");
    setState({ connected: true });
  });
  socket.on("disconnect", () => {
    console.log("disconnected from ws server :(");
    setState({ connected: false });
  });

  // handle already matched
  socket.on(MATCH_EVENTS.ROOM_EXISTS, (data) => {
    const { existingRoom }: { message: string; existingRoom: Room } =
      JSON.parse(data);
    console.log("existing room: ", { existingRoom });
    setState({ isInQueue: false, room: existingRoom });
  });

  // handle joined queue (no match found)
  socket.on(MATCH_EVENTS.JOIN_QUEUE_SUCCESS, (data) => {
    const { message }: { message: string } = JSON.parse(data);
    console.log("successfully joined queue: ", { message });
    setState({ isInQueue: true });
  });

  // handle match found
  socket.on(MATCH_EVENTS.MATCH_FOUND, (data) => {
    const { matchedRoom }: { message: string; matchedRoom: Room } =
      JSON.parse(data);
    console.log("matched room: ", { matchedRoom });
    setState({ isInQueue: false, room: matchedRoom });
  });

  // handle join queue error
  socket.on(MATCH_EVENTS.JOIN_QUEUE_ERROR, (data) => {
    const error: { message: string; error: Error } = JSON.parse(data);
    console.error("error joining queue: ", error);
    setState({ isInQueue: false });
  });

  // handle leave queue success
  socket.on(MATCH_EVENTS.LEAVE_QUEUE_SUCCESS, (data) => {
    const { message }: { message: string } = JSON.parse(data);
    console.log("successfully left queue: ", message);
    setState({ isInQueue: false });
  });

  // handle leave queue error
  socket.on(MATCH_EVENTS.LEAVE_QUEUE_ERROR, (data) => {
    const error: { message: string; error: Error } = JSON.parse(data);
    console.error("error leaving queue: ", error);
  });

  const setupVideo = async () => {
    const myVideoRef = getState().myVideo;
    if (!myVideoRef) {
      // break if my video ref not set
      return;
    }
    if (!myVideoRef.current) {
      // break if my video ref current not set
      return;
    }

    // store stream + set src object in my video ref
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    myVideoRef.current.srcObject = stream;
    setState({ stream });
  };

  const answerCall = () => {
    setState({ callAccepted: true });

    // set up peer
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
      const otherVideoRef = getState().otherVideo;
      if (!otherVideoRef) {
        // break if other video ref not set
        console.error("no other video element ref found");
        return;
      }
      if (!otherVideoRef.current) {
        // break if other video ref current not set
        console.error("no other video element ref current found");
        return;
      }
      otherVideoRef.current.srcObject = currentStream;
    });

    // send signal to peer
    const signal = getState().call.signal;
    if (!signal) {
      // break if signal not set
      return;
    }
    peer.signal(signal);

    // store peer in connection ref
    const connectionRef = getState().connectionRef;
    if (!connectionRef) {
      // break if connection ref not set
      return;
    }
    connectionRef.current = peer;
  };

  const callUser = (from: User, id: number) => {
    // set up peer
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: getState().stream,
    });

    peer.on("signal", (data) => {
      const socket = getState().socket;
      if (!socket) {
        // break if socket not set
        return;
      }
      socket.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: from,
      });
    });

    peer.on("stream", (currentStream) => {
      const otherVideoRef = getState().otherVideo;
      if (!otherVideoRef) {
        // break if other video ref not set
        console.error("no other video element ref found");
        return;
      }

      if (!otherVideoRef.current) {
        // break if other video ref current not set
        console.error("no other video element ref current found");
        return;
      }

      if (otherVideoRef.current) {
        otherVideoRef.current.srcObject = currentStream;
      }
    });

    // set up call accepted event
    const socket = getState().socket;
    if (!socket) {
      // break if socket not set
      return;
    }
    socket.on("callAccepted", (signal) => {
      setState({ callAccepted: true });
      peer.signal(signal);
    });

    // store peer in connection ref
    const connectionRef = getState().connectionRef;
    if (!connectionRef) {
      // break if connection ref not set
      return;
    }
    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setState({ callEnded: true });
    const connectionRef = getState().connectionRef;
    if (!connectionRef) {
      // break if connection ref not set
      return;
    }
    connectionRef.current?.destroy();
  };

  const joinQueue = (user: PoolUser) => {
    getState().socket?.emit("join", JSON.stringify(user));
  };

  const leaveQueue = (id: number) => {
    getState().socket?.emit("leave", JSON.stringify({ id }));
  };

  return {
    isInQueue: false,
    room: undefined,
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
    setupVideo,
    joinQueue,
    leaveQueue,
  };
};

export const useSocketStore = create<SocketStore>(SocketStoreValues);
