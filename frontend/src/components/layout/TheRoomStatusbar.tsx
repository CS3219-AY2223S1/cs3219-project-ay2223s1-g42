import { useNavigate } from "react-router";
import cx from "classnames";

import { Room } from "shared/api";
import { useGlobalStore } from "src/store";
import { PrimaryButton, RedButton } from "../base";
import { UserStatus } from "src/features";

const TheRoomStatusbar = ({ room }: { room: Room }) => {
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
        <div className="flex h-full w-full flex-col gap-1 truncate text-ellipsis md:w-auto">
          <div className="truncate text-lg font-bold md:ml-0">{room.id}</div>
          <div className="flex flex-row items-center justify-center gap-3">
            <div className="flex flex-none flex-row gap-1 truncate">
              {room.difficulties.map((difficulty, i) => (
                <p
                  key={`${difficulty.toString()} ${i}`}
                  className="text-sm font-bold capitalize text-neutral-900 md:text-xs md:font-bold md:uppercase"
                >
                  {difficulty.toString()}
                </p>
              ))}
            </div>
            <div className="flex w-full flex-row gap-2 truncate md:flex-row">
              {room.users.map((user) => (
                <UserStatus
                  key={user.id}
                  className="items-center justify-center"
                  user={user}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="flex w-full flex-row gap-2 text-sm md:w-auto md:flex-row md:gap-[6px]">
          <PrimaryButton
            className="w-full py-2.5 px-3 md:w-auto"
            onClick={handleReturnRoom}
          >
            Return
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
