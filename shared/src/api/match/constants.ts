export enum MATCH_EVENTS {
  JOIN_QUEUE = "join",
  JOIN_QUEUE_SUCCESS = "join-success",
  JOIN_QUEUE_ERROR = "join-failed",
  LEAVE_QUEUE = "leave",
  LEAVE_QUEUE_SUCCESS = "leave-success",
  LEAVE_QUEUE_ERROR = "leave-error",
  CANCEL_MATCH = "cancel-match",
  CANCEL_MATCH_SUCCESS = "cancel-match-success",
  CANCEL_MATCH_ERR = "cancel-match-error",
  MATCH_FOUND = "found-match",
  MATCH_CANCELLED = "match-cancelled",
  ROOM_EXISTS = "room-exists",
}

export enum MATCH_MESSAGES {
  JOIN_QUEUE = "joining queue...",
  JOIN_QUEUE_SUCCESS = "succesfully joined queue",
  JOIN_QUEUE_ERROR = "failed to join queue",
  LEAVE_QUEUE = "leaving queue...",
  LEAVE_QUEUE_SUCCESS = "successfully left queue",
  LEAVE_QUEUE_ERROR = "failed to leave queue",
  CANCEL_MATCH_SUCCESS = "successfully cancelled match",
  CANCEL_MATCH_ERR = "failed to cancel match",
  MATCH_FOUND = "found a match",
  MATCH_CANCELLED = "match cancelled by other user(s)",
  ROOM_EXISTS = "already matched",
}

export enum MATCH_ERRORS {
  HANDLE_FIND_MATCHING_USER_IDS = "failed to find a match",
  HANDLE_FOUND_MATCH = "failed to create room for matched users",
  HANDLE_JOIN_MATCH_QUEUE = "failed to add user to matching queues",
  HANDLE_LEAVE_MATCH_QUEUE = "failed to disconnect user from matching queues",
}

export const MATCH_WS_NAMESPACE = "match";
