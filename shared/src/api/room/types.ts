import { PoolUser } from "../match/types";

export type Room = {
  id: string;
  users: RoomUser[];
};

export type PendingRoomUser = {
  id: number;
  roomId: string;
};

export type RoomUser = PoolUser & {
  connected: boolean;
};
