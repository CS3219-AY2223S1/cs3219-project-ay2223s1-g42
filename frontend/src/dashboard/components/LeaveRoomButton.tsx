import { useNavigate } from "react-router";

import { RedButton } from "src/components";
import { useAuthStore } from "src/hooks";
import { useSocketStore } from "../hooks";

const LeaveRoomButton = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const { room, leaveRoom } = useSocketStore((state) => {
    return {
      room: state.room,
      leaveRoom: state.leaveRoom,
    };
  });
  return (
    <RedButton
      className="py-2.5 md:py-2 text-sm"
      onClick={() => {
        if (!user) {
          console.error("user not logged in, cannot leave room");
          return;
        }
        if (!room) {
          console.error("no room state set, cannot leave room");
          return;
        }
        leaveRoom(user, room.id);
        navigate("/");
      }}
    >
      disconnect
    </RedButton>
  );
};

export { LeaveRoomButton };
