/* eslint-disable @typescript-eslint/naming-convention */
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

enum ROOM_EVENTS {
  JOIN_ROOM = "join-room",
  JOIN_ROOM_ERROR = "join-room-error",
  LEAVE_ROOM = "leave-room",
  LEAVE_ROOM_ERR = "leave-room-error",
  INVALID_ROOM = "invalid-room",
  NEW_USER_JOINED = "new-user-joined",
  OLD_USER_LEFT = "old-user-left",
}

type SocketStore = {
  socket: Socket | undefined;
  // queue data
  roomId: string | undefined;
  isInQueue: boolean;
  joinQueue: (user: PoolUser) => void;
  leaveQueue: (id: number) => void;
  // room data
  roomSocket: Socket | undefined;
  room: Room | undefined;
  newUser: User | undefined;
  oldUser: User | undefined;
  joinRoom: (user: User, roomId: string) => void;
  leaveRoom: (user: User, roomId: string) => void;
  // video data
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
    const { existingRoomId }: { message: string; existingRoomId: string } =
      JSON.parse(data);
    console.log("existing room: ", { existingRoomId });
    setState({ isInQueue: false, roomId: existingRoomId });
  });

  // handle joined queue (no match found)
  socket.on(MATCH_EVENTS.JOIN_QUEUE_SUCCESS, (data) => {
    const { message }: { message: string } = JSON.parse(data);
    console.log("successfully joined queue: ", { message });
    setState({ isInQueue: true });
  });

  // handle match found
  socket.on(MATCH_EVENTS.MATCH_FOUND, (data) => {
    const { matchedRoomId }: { message: string; matchedRoomId: string } =
      JSON.parse(data);
    console.log("matched room: ", { matchedRoomId });
    // join room
    setState({ isInQueue: false, roomId: matchedRoomId });
  });

  // handle join queue error
  socket.on(MATCH_EVENTS.JOIN_QUEUE_ERROR, (data) => {
    const error: { error: Error } = JSON.parse(data);
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
    const error: { error: Error } = JSON.parse(data);
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
    const socket = getState().socket;
    if (!socket) {
      console.log("socket not set, cannot join queue");
      return;
    }
    socket.emit(MATCH_EVENTS.JOIN_QUEUE, JSON.stringify(user));
  };

  const leaveQueue = (id: number) => {
    const socket = getState().socket;
    if (!socket) {
      console.log("socket not set, cannot join queue");
      return;
    }
    const payload = JSON.stringify({ id });
    socket.emit(MATCH_EVENTS.LEAVE_QUEUE, payload);
  };

  const joinRoom = (user: User, roomId: string) => {
    const roomSocket = io(`${import.meta.env.VITE_API_URL}/room`, {
      withCredentials: true,
      transports: ["websocket"],
      autoConnect: true,
    });

    roomSocket.on(ROOM_EVENTS.NEW_USER_JOINED, (data) => {
      const { room, newUser }: { room: Room; newUser: User } = JSON.parse(data);
      console.log("new user joined: ", { room, newUser });
      setState({ room, newUser });
    });

    roomSocket.on(ROOM_EVENTS.OLD_USER_LEFT, (data) => {
      const { room, oldUser }: { room: Room; oldUser: User } = JSON.parse(data);
      console.log("old user left: ", { room, oldUser });
      setState({ room, oldUser });
    });

    roomSocket.on(ROOM_EVENTS.LEAVE_ROOM_ERR, (data) => {
      const { message }: { message: string } = JSON.parse(data);
      console.log("error leaving room: ", message);
    });

    roomSocket.on(ROOM_EVENTS.INVALID_ROOM, (data) => {
      const { message }: { message: string } = JSON.parse(data);
      console.log("invalid room: ", message);
    });

    const payload = JSON.stringify({ ...user, roomId });
    roomSocket.emit(ROOM_EVENTS.JOIN_ROOM, payload);
    console.log("setting room socket: ", roomSocket);
    setState({ roomSocket });
  };

  const leaveRoom = (user: User, roomId: string) => {
    const roomSocket = getState().roomSocket;
    if (!roomSocket) {
      console.log("room socket not set, cannot leave room");
      return;
    }
    const payload = JSON.stringify({ ...user, roomId });
    console.log("leave room payload: ", payload);
    roomSocket.emit(ROOM_EVENTS.LEAVE_ROOM, payload);
  };

  return {
    socket,
    // queue data
    roomId: undefined,
    isInQueue: false,
    joinQueue,
    leaveQueue,
    // room data
    roomSocket: undefined,
    room: undefined,
    newUser: undefined,
    oldUser: undefined,
    joinRoom,
    leaveRoom,
    // video data
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
  };
};

export const useSocketStore = create<SocketStore>(SocketStoreValues);
