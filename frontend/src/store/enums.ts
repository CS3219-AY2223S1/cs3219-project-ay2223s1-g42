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

export enum LANGUAGE {
  TS = "typescript",
  JS = "javascript",
  PY = "python",
  CPP = "cpp",
}
