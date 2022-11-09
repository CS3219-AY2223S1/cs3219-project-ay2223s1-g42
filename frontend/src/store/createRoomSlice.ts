import { StateCreator } from "zustand";
import { io, Socket } from "socket.io-client";
import toast, { ToastOptions } from "react-hot-toast";
import Peer from "simple-peer";

import { Room, RoomUser, ROOM_EVENTS, UserInfo } from "shared/api";
import type { Status, GlobalStore } from "./useGlobalStore";
import { StatusType } from "./enums";
import { Axios } from "src/services";
import { Call } from "./createCallSlice";

const roomToastOptions: ToastOptions = {
  id: "room-toast",
};

export type RoomSlice = {
  // room data
  roomSocket: Socket | undefined;
  roomStatus: Status | undefined;
  room: Room | undefined;
  newRoomUser: UserInfo | undefined;
  oldRoomUser: UserInfo | undefined;
  joinRoom: (roomId: string) => void;
  leaveRoom: () => void;
};

const createRoomSlice: StateCreator<GlobalStore, [], [], RoomSlice> = (
  setState,
  getState
) => {
  const roomSocket = io(`${import.meta.env.VITE_API_URL}/room`, {
    withCredentials: true,
    transports: ["websocket"],
    autoConnect: false,
    forceNew: false,
  });

  roomSocket.on("connect", () => {
    console.log("connected to /room ws server :)");
  });

  roomSocket.on("disconnect", async () => {
    await Axios.get("/auth/refresh");
    console.log("disconnected from /room ws server :(");
  });

  roomSocket.on(ROOM_EVENTS.JOIN_ROOM_SUCCESS, (data) => {
    const { room, isCaller }: { room: Room; isCaller: boolean } =
      JSON.parse(data);
    const roomStatusMsg = `Successfully joined room ${room.id}.`;
    const roomStatus: Status = {
      status: StatusType.SUCCESS,
      event: ROOM_EVENTS.JOIN_ROOM_SUCCESS,
      message: roomStatusMsg,
    };
    setState({ room, roomStatus, queueRoomId: undefined, isCaller });
  });

  roomSocket.on(ROOM_EVENTS.JOIN_ROOM_ERROR, (data) => {
    const { message }: { message: string } = JSON.parse(data);
    const roomStatusMsg = `Error occurred while joining room.`;
    const roomStatus: Status = {
      status: StatusType.ERROR,
      event: ROOM_EVENTS.JOIN_ROOM_ERROR,
      message: roomStatusMsg,
    };
    toast.error(roomStatusMsg, roomToastOptions);
    setState({ roomStatus });
  });

  roomSocket.on(ROOM_EVENTS.LEAVE_ROOM_SUCCESS, (data) => {
    const { message }: { message: string } = JSON.parse(data);
    const roomStatusMsg = `Successfully left room.`;
    const roomStatus: Status = {
      status: StatusType.SUCCESS,
      event: ROOM_EVENTS.LEAVE_ROOM_SUCCESS,
      message: roomStatusMsg,
    };
    toast.success(roomStatusMsg, roomToastOptions);
    setState({
      room: undefined,
      roomStatus,
      queueRoomId: undefined,
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
    toast.error(roomStatusMsg, roomToastOptions);
    setState({ roomStatus });
  });

  roomSocket.on(ROOM_EVENTS.INVALID_ROOM, (data) => {
    const { message }: { message: string } = JSON.parse(data);
    const roomStatusMsg = `Room provided is invalid. Please try searching for another match.`;
    const roomStatus: Status = {
      status: StatusType.ERROR,
      event: ROOM_EVENTS.INVALID_ROOM,
      message: roomStatusMsg,
    };
    toast.error(roomStatusMsg, roomToastOptions);
    setState({ roomStatus });
  });

  roomSocket.on(ROOM_EVENTS.NEW_USER_JOINED, (data) => {
    const { room, newUser }: { room: Room; newUser: UserInfo } =
      JSON.parse(data);
    const roomStatusMsg = `${newUser.username} has joined the room.`;
    const roomStatus: Status = {
      status: StatusType.INFO,
      event: ROOM_EVENTS.NEW_USER_JOINED,
      message: roomStatusMsg,
    };
    toast(roomStatusMsg, roomToastOptions);
    setState({ room, newRoomUser: newUser, roomStatus });
  });

  roomSocket.on(ROOM_EVENTS.OLD_USER_LEFT, (data) => {
    const { room, oldUser }: { room: Room; oldUser: UserInfo } =
      JSON.parse(data);
    const roomStatusMsg = `${oldUser.username} has left the room.`;
    const roomStatus: Status = {
      status: StatusType.INFO,
      event: ROOM_EVENTS.OLD_USER_LEFT,
      message: roomStatusMsg,
    };
    toast(roomStatusMsg, roomToastOptions);
    setState({ room, oldRoomUser: oldUser, roomStatus });
  });

  roomSocket.on(ROOM_EVENTS.CALL_USER, (data: any) => {
    const { signal, from }: { signal: Peer.SignalData; from: RoomUser } =
      JSON.parse(data);
    const call: Call = { from, signal, isCaller: false };
    setState({ call });
    getState().answerCall();
  });

  const joinRoom = (roomId: string) => {
    const user = getState().user;
    if (!user) {
      ("failed to emit JOIN_ROOM event, user not logged in!");
      return;
    }
    if (!roomSocket.connected) {
      roomSocket.connect();
    }
    const payload = JSON.stringify({ id: user.id, roomId });
    roomSocket.emit(ROOM_EVENTS.JOIN_ROOM, payload);
  };

  const leaveRoom = () => {
    const user = getState().user;
    const room = getState().room;
    const queueRoomId = getState().queueRoomId;
    const roomId = room?.id ?? queueRoomId;
    if (!user || !roomId) {
      ("failed to leave room, user not logged in or room id not found!");
      return;
    }
    if (!roomSocket.connected) {
      roomSocket.connect();
    }
    const payload = JSON.stringify({ id: user.id, roomId });
    roomSocket.emit(ROOM_EVENTS.LEAVE_ROOM, payload);
  };

  return {
    // room data
    roomSocket,
    roomStatus: undefined,
    room: undefined,
    newRoomUser: undefined,
    oldRoomUser: undefined,
    joinRoom,
    leaveRoom,
  };
};

export { createRoomSlice };
