import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import shallow from "zustand/shallow";

import { MATCH_EVENTS, ROOM_EVENTS } from "shared/api";
import { LoadingLayout, UnauthorizedPage } from "src/components";
import { LoadedRoom } from "src/features";
import { useGlobalStore } from "src/store";

const RoomPage = (): JSX.Element => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    user,
    queueRoomId,
    room,
    roomStatus,
    queueStatus,
    joinRoom,
    resetProviderBinding,
  } = useGlobalStore((state) => {
    return {
      user: state.user,
      queueRoomId: state.queueRoomId,
      room: state.room,
      roomStatus: state.roomStatus,
      queueStatus: state.queueStatus,
      joinRoom: state.joinRoom,
      resetProviderBinding: state.resetProviderBinding,
    };
  }, shallow);

  const pageRoomId = id ?? "default";
  const isQueuedRoom = pageRoomId === queueRoomId;
  const isInvalidRoom =
    roomStatus?.event === ROOM_EVENTS.INVALID_ROOM ||
    (queueRoomId && !isQueuedRoom);

  // join room on mount
  useEffect(() => {
    // only attempt to join room if user logged in and has not joined a room
    if (!user || (queueRoomId && !isQueuedRoom) || room) {
      return;
    }
    joinRoom(pageRoomId);
  }, []);

  // redirect to dashboard page if match cancelled
  useEffect(() => {
    if (
      queueStatus?.event === MATCH_EVENTS.CANCEL_MATCH_SUCCESS ||
      queueStatus?.event === MATCH_EVENTS.MATCH_CANCELLED
    ) {
      navigate("/");
      resetProviderBinding();
    }
  }, [queueStatus?.event, navigate, resetProviderBinding]);

  if (isInvalidRoom) {
    return (
      <UnauthorizedPage title="Unauthorized room. Try finding another match instead!" />
    );
  }

  if (!user) {
    return <UnauthorizedPage />;
  }

  if (room) {
    return <LoadedRoom />;
  }

  return <LoadingLayout />;
};

export default RoomPage;
