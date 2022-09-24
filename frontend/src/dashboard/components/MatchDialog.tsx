import { useEffect } from "react";
import { useNavigate } from "react-router";

import { RedButton, PrimaryDialog } from "src/components";
import { useSocketStore } from "../hooks";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export function MatchDialog({ isOpen, onClose }: Props) {
  const navigate = useNavigate();
  const { isInQueue, queueRoomId } = useSocketStore((state) => {
    return {
      isInQueue: state.isInQueue,
      queueRoomId: state.queueRoomId,
    };
  });

  const dialogTitle = queueRoomId ? "Match Found" : "Matching you now...";
  const dialogDescription = queueRoomId
    ? "You have been matched with a peer! Join the room now to start coding :)"
    : "Please hold while we search for a compatible match...";

  // redirect to room if matched room ID set
  useEffect(() => {
    if (queueRoomId) {
      navigate(`/room/${queueRoomId}`);
    }
  }, [navigate, queueRoomId]);

  // disconnect from queue after 30s
  useEffect(() => {
    if (!isInQueue) {
      return;
    }
    const timeout = setTimeout(() => {
      onClose();
    }, 30000);
    return () => {
      clearTimeout(timeout);
    };
  }, [isInQueue, onClose]);

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
