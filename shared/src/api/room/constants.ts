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
  CALL_USER = "call-user",
  ANSWER_CALL = "answer-call",
  CALL_ACCEPTED = "call-accepted",
  CALL_ENDED = "call-ended",
}

export enum ROOM_MESSAGES {
  JOIN_ROOM_SUCCESS = "successfully joined room",
  JOIN_ROOM_ERROR = "failed to join room",
  LEAVE_ROOM_SUCCESS = "successfully left room",
  LEAVE_ROOM_ERR = "failed to leave room",
  INVALID_ROOM = "room does not exist",
  NEW_USER_JOINED = "new user has joined the room",
  OLD_USER_LEFT = "user has left the room",
}

export const ROOM_WS_NAMESPACE = "room";
