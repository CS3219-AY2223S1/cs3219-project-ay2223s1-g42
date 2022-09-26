import { useEffect } from "react";
import { useParams } from "react-router";

import { LoadingLayout, UnauthorizedPage } from "src/components";
import { LoadedRoom, ROOM_EVENTS, useSocketStore } from "src/dashboard";
import { useAuthStore } from "src/hooks";

const RoomPage = (): JSX.Element => {
  const { id } = useParams();
  const user = useAuthStore((state) => state.user);
  const { queueRoomId, room, status, joinRoom } = useSocketStore((state) => {
    return {
      queueRoomId: state.queueRoomId,
      room: state.room,
      status: state.status,
      joinRoom: state.joinRoom,
    };
  });

  console.log("rendering main room page!");

  const pageRoomId = id ?? "default";
  const isValidRoom = pageRoomId === queueRoomId;

  useEffect(() => {
    // join room on mount
    if (!user) {
      return;
    }
    if (queueRoomId && !isValidRoom) {
      return;
    }
    if (!room) {
      console.log("joing room: ", { user, pageRoomId });
      joinRoom(user, pageRoomId);
    }
  }, []);

  if (
    status?.event === ROOM_EVENTS.INVALID_ROOM ||
    (queueRoomId && !isValidRoom)
  ) {
    return (
      <UnauthorizedPage title="Unauthorized room. Try finding another match instead!" />
    );
  }

  if (!user) {
    return <UnauthorizedPage />;
  }

  // if (
  //   status?.event === ROOM_EVENTS.INVALID_ROOM ||
  //   (queueRoomId && !isValidRoom)
  // ) {
  //   return (
  //     <UnauthorizedPage title="Invalid room. Head to the home page and try finding another match!" />
  //   );
  // }

  if (room) {
    return <LoadedRoom roomId={pageRoomId} user={user} />;
  }

  return <LoadingLayout />;
};

export default RoomPage;
