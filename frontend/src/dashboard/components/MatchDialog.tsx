import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router";
import { PrimaryButton, RedButton } from "src/components/base";
import { PrimaryDialog } from "src/components/base/dialog";
import { useAuthStore } from "src/hooks";
import { useSocketStore } from "../hooks";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export function MatchDialog({ isOpen, onClose }: Props) {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const { isInQueue, roomId } = useSocketStore((state) => {
    return {
      isInQueue: state.isInQueue,
      roomId: state.roomId,
    };
  });

  const dialogTitle = roomId ? "Match Found" : "Matching you now...";
  const dialogDescription = roomId
    ? "You have been matched with a peer! Join the room now to start coding :)"
    : "Please hold while we search for a compatible match...";

  useEffect(() => {
    if (roomId) {
      navigate(`/room/${roomId}`);
    }
  }, [navigate, roomId]);

  return (
    <PrimaryDialog
      isOpen={isOpen}
      onClose={onClose}
      title={dialogTitle}
      description={dialogDescription}
    >
      <div className="flex flex-col gap-6">
        {/* {!isInQueue ? (
          <div>Not in queue!</div>
        ) : (
          <>
            <div className="flex flex-col gap-1">
              <p>Room ID: {roomId}</p>
            </div>
            <div className="flex flex-col justify-center gap-2">
              {roomId ? (
                <PrimaryButton className="w-full">Enter room now</PrimaryButton>
              ) : (
                <></>
              )}
            </div>
          </>
        )} */}
        <RedButton className="w-full" onClick={onClose}>
          Disconnect
        </RedButton>
      </div>
    </PrimaryDialog>
  );
}
