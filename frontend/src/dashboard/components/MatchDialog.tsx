import { useMemo } from "react";

import { PrimaryButton, RedButton } from "src/components/base";
import { PrimaryDialog } from "src/components/base/dialog";
import { useAuthStore, useSocketStore } from "src/hooks";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export function MatchDialog({ isOpen, onClose }: Props) {
  const user = useAuthStore((state) => state.user);
  const room = useSocketStore((state) => state.room);
  const otherUser = room?.users.filter((u) => u.id !== user?.id)[0];

  const dialogTitle = room ? "Match Found" : "Matching you now...";
  const dialogDescription = room
    ? "You have been matched with a peer! Join the room now to start coding :)"
    : "Please hold while we search for a compatible match...";

  return (
    <PrimaryDialog
      isOpen={isOpen}
      onClose={onClose}
      title={dialogTitle}
      description={dialogDescription}
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <p>Email: {otherUser?.email}</p>
          <p>Username: {otherUser?.username}</p>
        </div>
        <div className="flex flex-col justify-center gap-2">
          {room ? (
            <PrimaryButton className="w-full">Enter room now</PrimaryButton>
          ) : (
            <></>
          )}
          <RedButton className="w-full">Disconnect</RedButton>
        </div>
      </div>
    </PrimaryDialog>
  );
}
