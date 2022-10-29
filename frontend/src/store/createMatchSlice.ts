import { StateCreator } from "zustand";
import { io, Socket } from "socket.io-client";
import toast, { ToastOptions } from "react-hot-toast";

import {
  MatchType,
  MATCH_EVENTS,
  PoolUserData,
  QuestionDifficulty,
} from "shared/api";
import { Axios } from "src/services";
import type { GlobalStore, Status } from "./useGlobalStore";
import { StatusType } from "./enums";

export const matchToastOptions: ToastOptions = {
  id: "match-toast",
};

export type MatchSlice = {
  matchSocket: Socket | undefined;
  matchSocketConnected: boolean;
  matchDifficulties: QuestionDifficulty[];
  setMatchDifficulties: (difficulties: QuestionDifficulty[]) => void;
  matchTopics: string[] | undefined;
  setMatchTopics: (topics: string[]) => void;
  matchType: MatchType | undefined;
  setMatchType: (type: MatchType | undefined) => void;
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

  const setMatchTopics = (topics: string[]) => {
    setState({ matchTopics: topics });
  };

  const setMatchType = (type: MatchType | undefined) => {
    setState({ matchType: type });
  };

  const matchSocket = io(`${import.meta.env.VITE_API_URL}/match`, {
    withCredentials: true,
    transports: ["websocket"],
    autoConnect: false,
  });

  matchSocket.on("connect", () => {
    console.log("connected to /match ws server :)");
    toast.success("Connected to match server", matchToastOptions);
    setState({ matchSocketConnected: true });
  });

  matchSocket.on("disconnect", async () => {
    console.log("disconnected from /match ws server :(");
    await Axios.get("/auth/refresh");
    const user = getState().user;
    if (user) {
      toast.loading("Connecting to match server...", matchToastOptions);
    }
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
    toast.success(queueStatusMsg, matchToastOptions);
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
    toast.error(queueStatusMsg, matchToastOptions);
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
    toast.success(queueStatusMsg, matchToastOptions);
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
    toast.error(queueStatusMsg, matchToastOptions);
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
    toast.error(queueStatusMsg, matchToastOptions);
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
    toast.error(queueStatusMsg, matchToastOptions);
    setState({ queueStatus });
  });

  matchSocket.on(MATCH_EVENTS.MATCH_CANCELLED, (data) => {
    const { message }: { message: string } = JSON.parse(data);
    const queueStatusMsg = `Match cancelled by other user(s), finding new match...`;
    const queueStatus: Status = {
      status: StatusType.INFO,
      event: MATCH_EVENTS.MATCH_CANCELLED,
      message: queueStatusMsg,
    };
    toast.error(queueStatusMsg, matchToastOptions);
    setState({ queueStatus, queueRoomId: undefined, room: undefined });
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
    matchDifficulties: [QuestionDifficulty.EASY],
    setMatchDifficulties,
    matchTopics: [],
    setMatchTopics,
    matchType: undefined,
    setMatchType,
    queueStatus: undefined,
    isInQueue: false,
    queueRoomId: undefined,
    joinQueue,
    leaveQueue,
    cancelMatch,
  };
};

export { createMatchSlice };
