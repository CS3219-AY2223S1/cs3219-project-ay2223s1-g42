import { useEffect } from "react";
import { useParams } from "react-router";
import shallow from "zustand/shallow";

import { LoadingLayout, UnauthorizedPage } from "src/components";
import { LoadedRoom } from "src/features";
import { useGlobalStore } from "src/store";
import { ROOM_EVENTS } from "shared/api";

const RoomPage = (): JSX.Element => {
  const { id } = useParams();
  const { user, queueRoomId, room, roomStatus, joinRoom } = useGlobalStore(
    (state) => {
      return {
        user: state.user,
        queueRoomId: state.queueRoomId,
        room: state.room,
        roomStatus: state.roomStatus,
        joinRoom: state.joinRoom,
      };
    },
    shallow
  );

  const pageRoomId = id ?? "default";
  const isValidRoom = pageRoomId === queueRoomId;

  // join room on mount
  useEffect(() => {
    if (!user) {
      return;
    }
    if (queueRoomId && !isValidRoom) {
      return;
    }
    if (!room) {
      console.log("joing room: ", { user, pageRoomId });
      joinRoom(pageRoomId);
    }
  }, []);

  if (
    roomStatus?.event === ROOM_EVENTS.INVALID_ROOM ||
    (queueRoomId && !isValidRoom)
  ) {
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
