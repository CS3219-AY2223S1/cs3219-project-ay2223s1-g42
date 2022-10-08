import { StateCreator } from "zustand";
import { io, Socket } from "socket.io-client";
import toast from "react-hot-toast";

import type { GlobalStore, Status } from "./useGlobalStore";
import { StatusType } from "./enums";
import { MATCH_EVENTS, PoolUserData, QuestionDifficulty } from "shared/api";

export type MatchSlice = {
  matchSocket: Socket | undefined;
  matchSocketConnected: boolean;
  matchDifficulties: QuestionDifficulty[];
  setMatchDifficulties: (difficulties: QuestionDifficulty[]) => void;
  queueStatus: Status | undefined;
  isInQueue: boolean;
  queueRoomId: string | undefined;
  joinQueue: (difficulties: QuestionDifficulty[]) => void;
  leaveQueue: () => void;
  cancelMatch: () => void;
};

const createMatchSlice: StateCreator<GlobalStore, [], [], MatchSlice> = (
  setState,
  getState
) => {
  const setMatchDifficulties = (difficulties: QuestionDifficulty[]) => {
    setState({ matchDifficulties: difficulties });
  };

  const matchSocket = io(`${import.meta.env.VITE_API_URL}/match`, {
    withCredentials: true,
    transports: ["websocket"],
    autoConnect: false,
  });

  matchSocket.on("connect", () => {
    console.log("connected to /match ws server :)");
    setState({ matchSocketConnected: true });
  });

  matchSocket.on("disconnect", () => {
    console.log("disconnected from /match ws server :(");
    setState({ matchSocketConnected: false });
  });

  // handle already matched
  matchSocket.on(MATCH_EVENTS.ROOM_EXISTS, (data) => {
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
      queueStatus: queueStatus,
    });
  });

  // handle joined queue (no match found)
  matchSocket.on(MATCH_EVENTS.JOIN_QUEUE_SUCCESS, (data) => {
    const { message }: { message: string } = JSON.parse(data);
    const queueStatus: Status = {
      status: StatusType.SUCCESS,
      event: MATCH_EVENTS.JOIN_QUEUE_SUCCESS,
      message,
    };
    setState({ isInQueue: true, queueStatus });
  });

  // handle match found
  matchSocket.on(MATCH_EVENTS.MATCH_FOUND, (data) => {
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
      queueStatus,
    });
  });

  // handle join queue error
  matchSocket.on(MATCH_EVENTS.JOIN_QUEUE_ERROR, (data) => {
    const { message }: { message: string } = JSON.parse(data);
    const queueStatusMsg = "Error joining queue. Try again later!";
    const queueStatus: Status = {
      status: StatusType.ERROR,
      event: MATCH_EVENTS.JOIN_QUEUE_ERROR,
      message: queueStatusMsg,
    };
    toast(queueStatusMsg);
    console.error(message);
    setState({ isInQueue: false, queueStatus });
  });

  // handle leave queue success
  matchSocket.on(MATCH_EVENTS.LEAVE_QUEUE_SUCCESS, (data) => {
    const { message }: { message: string } = JSON.parse(data);
    const queueStatusMsg = "Left queue successfully!";
    const queueStatus: Status = {
      status: StatusType.SUCCESS,
      event: MATCH_EVENTS.LEAVE_QUEUE_SUCCESS,
      message: queueStatusMsg,
    };
    toast(queueStatusMsg);
    setState({ isInQueue: false, queueRoomId: undefined, queueStatus });
  });

  // handle leave queue error
  matchSocket.on(MATCH_EVENTS.LEAVE_QUEUE_ERROR, (data) => {
    const { message }: { message: string } = JSON.parse(data);
    const queueStatusMsg = "Error leaving queue. Try again later!";
    const queueStatus: Status = {
      status: StatusType.ERROR,
      event: MATCH_EVENTS.LEAVE_QUEUE_ERROR,
      message: queueStatusMsg,
    };
    toast(queueStatusMsg);
    console.error(message);
    setState({ queueStatus });
  });

  matchSocket.on(MATCH_EVENTS.CANCEL_MATCH_SUCCESS, (data) => {
    const { message }: { message: string } = JSON.parse(data);
    const queueStatusMsg = `Match has been cancelled!`;
    const queueStatus: Status = {
      status: StatusType.INFO,
      event: MATCH_EVENTS.CANCEL_MATCH_SUCCESS,
      message: queueStatusMsg,
    };
    toast(queueStatusMsg);
    setState({ queueStatus, queueRoomId: undefined, room: undefined });
  });

  matchSocket.on(MATCH_EVENTS.CANCEL_MATCH_ERR, (data) => {
    const { message }: { message: string } = JSON.parse(data);
    const queueStatusMsg = `Error occurred while cancelling match.`;
    const queueStatus: Status = {
      status: StatusType.ERROR,
      event: MATCH_EVENTS.CANCEL_MATCH_ERR,
      message: queueStatusMsg,
    };
    toast(queueStatusMsg);
    setState({ queueStatus });
  });

  const joinQueue = (difficulties: QuestionDifficulty[]) => {
    const user = getState().user;
    if (!user) {
      console.error("user not logged in, cannot join queue!");
      return;
    }
    const socket = getState().matchSocket;
    if (!socket) {
      console.error("socket not set, cannot join queue!");
      return;
    }
    const poolUser: PoolUserData = {
      ...user,
      difficulties,
    };
    socket.emit(MATCH_EVENTS.JOIN_QUEUE, JSON.stringify(poolUser));
  };

  const leaveQueue = () => {
    const user = getState().user;
    const socket = getState().matchSocket;
    const isInQueue = getState().isInQueue;
    if (!user || !socket || !isInQueue) {
      console.error(
        "failed to leave queue, user/socket/not set OR not in queue"
      );
      return;
    }
    if (!matchSocket.connected) {
      matchSocket.connect();
    }
    const payload = JSON.stringify({ id: user.id });
    socket.emit(MATCH_EVENTS.LEAVE_QUEUE, payload);
  };

  const cancelMatch = () => {
    const user = getState().user;
    const room = getState().room;
    const queueRoomId = getState().queueRoomId;
    if (room) {
      console.error("failed to cancel room, user has already joined room!");
      return;
    }
    if (!user || !queueRoomId) {
      console.error(
        "failed to cancel room, user not logged in or user not matched a room"
      );
      return;
    }
    if (!matchSocket.connected) {
      matchSocket.connect();
    }
    const payload = JSON.stringify({ id: user.id, roomId: queueRoomId });
    matchSocket.emit(MATCH_EVENTS.CANCEL_MATCH, payload);
  };

  return {
    matchSocket,
    matchSocketConnected: false,
    matchDifficulties: ["easy"],
    setMatchDifficulties,
    queueStatus: undefined,
    isInQueue: false,
    queueRoomId: undefined,
    joinQueue,
    leaveQueue,
    cancelMatch,
  };
};

export { createMatchSlice };
