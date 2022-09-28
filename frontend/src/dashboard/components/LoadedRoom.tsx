import { useNavigate } from "react-router";

import { RedButton } from "src/components";
import { User } from "src/login";
import { RoomTabs } from "src/room";
import { useGlobalStore } from "src/store";
import { RoomEditor } from "./RoomEditor";
import { RoomListBox } from "./RoomListBox";

const LeaveRoomButton = () => {
  const navigate = useNavigate();
  const { user, leaveRoom } = useGlobalStore((state) => {
    return {
      user: state.user,
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
        leaveRoom();
        navigate("/");
      }}
    >
      disconnect
    </RedButton>
  );
};

type LoadedRoomProps = {
  roomId: string;
  user: User;
};

const LoadedRoom = ({ roomId, user }: LoadedRoomProps) => {
  return (
    <div className="flex flex-col lg:flex-row gap-3 w-full h-full py-3">
      <div className="w-full h-full max-h-full border-[1px] border-neutral-800">
        <RoomTabs />
      </div>
      <div className="flex flex-col w-full h-full border-neutral-900 border-[1px]">
        <div className="flex flex-row items-center justify-between w-full">
          <RoomListBox />
          <LeaveRoomButton />
        </div>
        <RoomEditor roomId={roomId} user={user} />
      </div>
    </div>
  );
};

export { LoadedRoom };
