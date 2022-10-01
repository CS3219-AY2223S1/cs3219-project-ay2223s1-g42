import create from "zustand";

import { AuthSlice, createAuthSlice } from "./createAuthSlice";
import { CallSlice, createCallSlice } from "./createCallSlice";
import { createEditorSlice, EditorSlice } from "./createEditorSlice";
import { MatchSlice, createMatchSlice } from "./createMatchSlice";
import { RoomSlice, createRoomSlice } from "./createRoomSlice";
import { StatusType } from "./enums";
import { MATCH_EVENTS, ROOM_EVENTS } from "shared/api";

export type Status = {
  status: StatusType;
  event: ROOM_EVENTS | MATCH_EVENTS;
  message: string;
};

export type GlobalStore = AuthSlice &
  MatchSlice &
  RoomSlice &
  EditorSlice &
  CallSlice;

const useGlobalStore = create<GlobalStore>()((...createStates) => ({
  ...createAuthSlice(...createStates),
  ...createMatchSlice(...createStates),
  ...createRoomSlice(...createStates),
  ...createEditorSlice(...createStates),
  ...createCallSlice(...createStates),
}));

export { useGlobalStore };
