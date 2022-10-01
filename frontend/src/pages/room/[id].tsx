import { useEffect } from "react";
import { useParams } from "react-router";

import { LoadingLayout, UnauthorizedPage } from "src/components";
import { LoadedRoom } from "src/dashboard";
import { useGlobalStore } from "src/store";
import { ROOM_EVENTS } from "shared/api";

const RoomPage = (): JSX.Element => {
  const { id } = useParams();
  const { user, queueRoomId, room, roomStatus, joinRoom, cleanupEditor } =
    useGlobalStore((state) => {
      return {
        user: state.user,
        queueRoomId: state.queueRoomId,
        room: state.room,
        roomStatus: state.roomStatus,
        joinRoom: state.joinRoom,
        cleanupEditor: state.cleanupEditor,
      };
    });

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
    return () => {
      cleanupEditor();
    };
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
    return <LoadedRoom roomId={pageRoomId} user={user} />;
  }

  return <LoadingLayout />;
};

export default RoomPage;
