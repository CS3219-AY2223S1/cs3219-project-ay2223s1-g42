import { useNavigate } from "react-router";
import shallow from "zustand/shallow";

import { RedButton } from "src/components";
import { useGlobalStore } from "src/store";
import { RoomEditor } from "./RoomEditor";
import { RoomListBox } from "./RoomListBox";
import { RoomTabs } from "./RoomTabs";

const LeaveRoomButton = () => {
  const navigate = useNavigate();
  const { user, leaveRoom, resetProviderBinding } = useGlobalStore((state) => {
    return {
      user: state.user,
      leaveRoom: state.leaveRoom,
      resetProviderBinding: state.resetProviderBinding,
    };
  }, shallow);
  return (
    <RedButton
      className="border-[1px] border-l-neutral-900 py-2.5 md:py-2"
      onClick={() => {
        if (!user) {
          console.error("user not logged in, cannot leave room");
          return;
        }
        leaveRoom();
        resetProviderBinding();
        navigate("/");
      }}
    >
      disconnect
    </RedButton>
  );
};

const LoadedRoom = () => {
  console.log("rendering loaded room component!");
  return (
    <div className="flex h-full w-full flex-col gap-3 py-3 lg:flex-row">
      <div className="h-full max-h-full w-full border-[1px] border-neutral-800 pb-1">
        <RoomTabs />
      </div>
      <div className="flex h-full w-full flex-col border-[1px] border-neutral-900">
        <div className="flex w-full flex-row items-center justify-between">
          <RoomListBox />
          <LeaveRoomButton />
        </div>
        <RoomEditor />
      </div>
    </div>
  );
};

export { LoadedRoom };
