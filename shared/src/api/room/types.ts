import { PoolUser } from "../match/types";
import { QuestionDifficulty } from "../question";

export type RoomUser = PoolUser & {
  connected: boolean;
};

export type Room = {
  id: string;
  users: RoomUser[];
  difficulties?: QuestionDifficulty[];
  topics?: string[];
};

export type PendingRoomUser = {
  id: number;
  roomId: string;
};
