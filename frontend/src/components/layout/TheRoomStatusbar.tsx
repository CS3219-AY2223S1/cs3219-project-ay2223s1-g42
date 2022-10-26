import cx from "classnames";
import { useNavigate } from "react-router";
import { Room, RoomUser } from "shared/api";
import { useGlobalStore } from "src/store";

import { PrimaryButton, RedButton } from "../base";
import { CheckIcon, SpinnerIcon } from "../icons";

const UserStatus = ({ user }: { user: RoomUser }) => {
  return (
    <div className="flex flex-row items-center justify-center gap-1 text-base md:text-sm">
      {user.connected ? (
        <CheckIcon className="h- w-4 stroke-[3px] text-green-500" />
      ) : (
        <SpinnerIcon className="h-4 w-4" />
      )}
      <span>{user.username}</span>
    </div>
  );
};

const TheRoomStatusbar = ({ room }: { room: Room }) => {
  console.log("rendered room status bar!");
  const leaveRoom = useGlobalStore((state) => state.leaveRoom);
  const navigate = useNavigate();
  const handleReturnRoom = () => {
    navigate(`/room/${room.id}`);
  };
  return (
    <nav
      className={cx(
        "fixed bottom-3 left-1/2 z-50 flex h-auto w-full max-w-2xl",
        "-translate-x-1/2 px-4"
      )}
    >
      <div className="flex w-full flex-col items-center justify-between gap-3 border-[1px] border-neutral-900 bg-white p-2 pl-3 md:flex-row">
        <div className="w-full truncate text-ellipsis md:w-auto">
          <div className="truncate font-bold md:ml-0 md:mb-1">{room.id}</div>
          <div className="flex w-full flex-row gap-2 truncate md:flex-row">
            {room.users.map((user) => (
              <UserStatus key={user.id} user={user} />
            ))}
          </div>
        </div>
        <div className="flex w-full flex-row gap-2 text-sm md:w-auto md:flex-row md:gap-[6px]">
          <PrimaryButton
            className="w-full py-2.5 px-3 md:w-auto"
            onClick={handleReturnRoom}
          >
            Return to room
          </PrimaryButton>
          <RedButton
            className="w-full py-2.5 px-3 md:w-auto"
            onClick={leaveRoom}
          >
            Disconnect
          </RedButton>
        </div>
      </div>
    </nav>
  );
};

export { TheRoomStatusbar };
