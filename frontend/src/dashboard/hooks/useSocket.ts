/* eslint-disable @typescript-eslint/naming-convention */
import React from "react";
import { io, Socket } from "socket.io-client";
import Peer from "simple-peer";
import create from "zustand";

import { User } from "src/login";
import toast from "react-hot-toast";

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

export enum MATCH_EVENTS {
  JOIN_QUEUE = "join",
  JOIN_QUEUE_SUCCESS = "join-success",
  JOIN_QUEUE_ERROR = "join-failed",
  LEAVE_QUEUE = "leave",
  LEAVE_QUEUE_SUCCESS = "leave-success",
  LEAVE_QUEUE_ERROR = "leave-error",
  MATCH_FOUND = "found",
  ROOM_EXISTS = "matched",
}

export enum ROOM_EVENTS {
  JOIN_ROOM = "join-room",
  JOIN_ROOM_SUCCESS = "join-room-success",
  JOIN_ROOM_ERROR = "join-room-error",
  LEAVE_ROOM = "leave-room",
  LEAVE_ROOM_SUCCESS = "leave-room-success",
  LEAVE_ROOM_ERR = "leave-room-error",
  INVALID_ROOM = "invalid-room",
  NEW_USER_JOINED = "new-user-joined",
  OLD_USER_LEFT = "old-user-left",
}

export enum StatusType {
  SUCCESS = "Success",
  ERROR = "Error",
  INFO = "Info",
}

type Status = {
  status: StatusType;
  event: ROOM_EVENTS | MATCH_EVENTS;
  message: string;
};

type SocketStore = {
  socket: Socket | undefined;
  status: Status | undefined;
  // queue data
  queueRoomId: string | undefined;
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
    console.log("connected to /match ws server :)");
    setState({ connected: true });
  });

  socket.on("disconnect", () => {
    console.log("disconnected from /match ws server :(");
    setState({ connected: false });
  });

  // handle already matched
  socket.on(MATCH_EVENTS.ROOM_EXISTS, (data) => {
    const {
      message,
      existingRoomId,
    }: { message: string; existingRoomId: string } = JSON.parse(data);
    const queueStatusMsg = `You are already in room ${existingRoomId}. Leave the room before trying to join another match!`;
    const queueStatus: Status = {
      status: StatusType.ERROR,
      event: MATCH_EVENTS.ROOM_EXISTS,
      message: queueStatusMsg,
    };
    toast(queueStatusMsg);
    console.error(message);
    setState({
      isInQueue: false,
      queueRoomId: existingRoomId,
      status: queueStatus,
    });
  });

  // handle joined queue (no match found)
  socket.on(MATCH_EVENTS.JOIN_QUEUE_SUCCESS, (data) => {
    const { message }: { message: string } = JSON.parse(data);
    const queueStatus: Status = {
      status: StatusType.SUCCESS,
      event: MATCH_EVENTS.JOIN_QUEUE_SUCCESS,
      message,
    };
    setState({ isInQueue: true, status: queueStatus });
  });

  // handle match found
  socket.on(MATCH_EVENTS.MATCH_FOUND, (data) => {
    const { matchedRoomId }: { message: string; matchedRoomId: string } =
      JSON.parse(data);
    const queueStatusMsg = `Match found! Joining room ${matchedRoomId}...`;
    const queueStatus: Status = {
      status: StatusType.SUCCESS,
      event: MATCH_EVENTS.MATCH_FOUND,
      message: queueStatusMsg,
    };
    toast(queueStatusMsg);
    // join room
    setState({
      isInQueue: false,
      queueRoomId: matchedRoomId,
      status: queueStatus,
    });
  });

  // handle join queue error
  socket.on(MATCH_EVENTS.JOIN_QUEUE_ERROR, (data) => {
    const { message }: { message: string } = JSON.parse(data);
    const queueStatusMsg = "Error joining queue. Try again later!";
    const queueStatus: Status = {
      status: StatusType.ERROR,
      event: MATCH_EVENTS.JOIN_QUEUE_ERROR,
      message: queueStatusMsg,
    };
    toast(queueStatusMsg);
    console.error(message);
    setState({ isInQueue: false, status: queueStatus });
  });

  // handle leave queue success
  socket.on(MATCH_EVENTS.LEAVE_QUEUE_SUCCESS, (data) => {
    const { message }: { message: string } = JSON.parse(data);
    const queueStatusMsg = "Left queue successfully!";
    const queueStatus: Status = {
      status: StatusType.SUCCESS,
      event: MATCH_EVENTS.LEAVE_QUEUE_SUCCESS,
      message: queueStatusMsg,
    };
    toast(queueStatusMsg);
    setState({ isInQueue: false, queueRoomId: undefined, status: queueStatus });
  });

  // handle leave queue error
  socket.on(MATCH_EVENTS.LEAVE_QUEUE_ERROR, (data) => {
    const { message }: { message: string } = JSON.parse(data);
    const queueStatusMsg = "Error leaving queue. Try again later!";
    const queueStatus: Status = {
      status: StatusType.ERROR,
      event: MATCH_EVENTS.LEAVE_QUEUE_ERROR,
      message: queueStatusMsg,
    };
    toast(queueStatusMsg);
    console.error(message);
    setState({ status: queueStatus });
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

  const roomSocket = io(`${import.meta.env.VITE_API_URL}/room`, {
    withCredentials: true,
    transports: ["websocket"],
    autoConnect: true,
    forceNew: true,
  });

  roomSocket.on("connect", () => {
    console.log("connected to /room ws server :)");
  });

  roomSocket.on("disconnect", () => {
    console.log("disconnected from /room ws server :(");
  });

  roomSocket.on(ROOM_EVENTS.JOIN_ROOM_SUCCESS, (data) => {
    const { room }: { room: Room } = JSON.parse(data);
    console.log("successfully joined room: ", { room });
    const roomStatusMsg = `Successfully joined room ${room.id}.`;
    const roomStatus: Status = {
      status: StatusType.SUCCESS,
      event: ROOM_EVENTS.JOIN_ROOM_SUCCESS,
      message: roomStatusMsg,
    };
    setState({ room, status: roomStatus });
  });

  roomSocket.on(ROOM_EVENTS.JOIN_ROOM_ERROR, (data) => {
    const { message }: { message: string } = JSON.parse(data);
    const roomStatusMsg = `Error occurred while joining room.`;
    const roomStatus: Status = {
      status: StatusType.ERROR,
      event: ROOM_EVENTS.JOIN_ROOM_ERROR,
      message: roomStatusMsg,
    };
    toast(roomStatusMsg);
    setState({ status: roomStatus });
  });

  roomSocket.on(ROOM_EVENTS.LEAVE_ROOM_SUCCESS, (data) => {
    const { message }: { message: string } = JSON.parse(data);
    const roomStatusMsg = `Successfully left room.`;
    const roomStatus: Status = {
      status: StatusType.SUCCESS,
      event: ROOM_EVENTS.LEAVE_ROOM_SUCCESS,
      message: roomStatusMsg,
    };
    toast(roomStatusMsg);
    setState({
      room: undefined,
      queueRoomId: undefined,
      status: roomStatus,
    });
  });

  roomSocket.on(ROOM_EVENTS.LEAVE_ROOM_ERR, (data) => {
    const { message }: { message: string } = JSON.parse(data);
    const roomStatusMsg = `Error occurred while leaving room.`;
    const roomStatus: Status = {
      status: StatusType.ERROR,
      event: ROOM_EVENTS.LEAVE_ROOM_ERR,
      message: roomStatusMsg,
    };
    toast(roomStatusMsg);
    setState({ status: roomStatus });
  });

  roomSocket.on(ROOM_EVENTS.INVALID_ROOM, (data) => {
    const { message }: { message: string } = JSON.parse(data);
    const roomStatusMsg = `Room provided is invalid. Please try searching for another match.`;
    const roomStatus: Status = {
      status: StatusType.ERROR,
      event: ROOM_EVENTS.INVALID_ROOM,
      message: roomStatusMsg,
    };
    toast(roomStatusMsg);
    setState({ status: roomStatus });
  });

  roomSocket.on(ROOM_EVENTS.NEW_USER_JOINED, (data) => {
    const { room, newUser }: { room: Room; newUser: User } = JSON.parse(data);
    const roomStatusMsg = `${newUser.username} has joined the room.`;
    const roomStatus: Status = {
      status: StatusType.INFO,
      event: ROOM_EVENTS.NEW_USER_JOINED,
      message: roomStatusMsg,
    };
    toast(roomStatusMsg);
    setState({ room, newUser, status: roomStatus });
  });

  roomSocket.on(ROOM_EVENTS.OLD_USER_LEFT, (data) => {
    const { room, oldUser }: { room: Room; oldUser: User } = JSON.parse(data);
    const roomStatusMsg = `${oldUser.username} has left the room.`;
    const roomStatus: Status = {
      status: StatusType.INFO,
      event: ROOM_EVENTS.OLD_USER_LEFT,
      message: roomStatusMsg,
    };
    toast(roomStatusMsg);
    setState({ room, oldUser, status: roomStatus });
  });

  const joinRoom = (user: User, roomId: string) => {
    if (!roomSocket.connected) {
      console.error(
        "failed to emit JOIN_ROOM event, room socket not connected"
      );
      return;
    }
    // roomSocket.connect();
    const payload = JSON.stringify({ ...user, roomId });
    console.log("joining room: ", { payload });
    roomSocket.emit(ROOM_EVENTS.JOIN_ROOM, payload);
  };

  const leaveRoom = (user: User, roomId: string) => {
    const payload = JSON.stringify({ ...user, roomId });
    console.log("leave room payload: ", payload);
    roomSocket.emit(ROOM_EVENTS.LEAVE_ROOM, payload);
    // kill room socket
    // roomSocket.disconnect();
  };

  return {
    socket,
    status: undefined,
    // queue data
    queueRoomId: undefined,
    isInQueue: false,
    joinQueue,
    leaveQueue,
    // room data
    roomSocket,
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
