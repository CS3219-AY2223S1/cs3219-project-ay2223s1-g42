import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import shallow from "zustand/shallow";

import { LoadingLayout, UnauthorizedPage } from "src/components";
import { LoadedRoom } from "src/features";
import { useGlobalStore } from "src/store";
import { MATCH_EVENTS, ROOM_EVENTS } from "shared/api";

const RoomPage = (): JSX.Element => {
  console.log("rendering room page component!");
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, queueRoomId, room, roomStatus, queueStatus, joinRoom } =
    useGlobalStore((state) => {
      return {
        user: state.user,
        queueRoomId: state.queueRoomId,
        room: state.room,
        roomStatus: state.roomStatus,
        queueStatus: state.queueStatus,
        joinRoom: state.joinRoom,
      };
    }, shallow);

  const pageRoomId = id ?? "default";
  const isQueuedRoom = pageRoomId === queueRoomId;
  const isInvalidRoom =
    roomStatus?.event === ROOM_EVENTS.INVALID_ROOM ||
    (queueRoomId && !isQueuedRoom);

  // join room on mount
  useEffect(() => {
    if (!user) {
      return;
    }
    if (queueRoomId && !isQueuedRoom) {
      return;
    }
    if (!room) {
      console.log("joing room: ", { user, pageRoomId });
      joinRoom(pageRoomId);
    }
  }, []);

  // redirect to dashboard page if match cancelled
  useEffect(() => {
    if (queueStatus?.event === MATCH_EVENTS.CANCEL_MATCH_SUCCESS) {
      navigate("/");
    }
  }, [queueStatus?.event, navigate]);

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
