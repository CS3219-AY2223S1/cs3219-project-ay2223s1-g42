import { useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

import { RedButton, PrimaryDialog, PrimaryButton } from "src/components";
import { useGlobalStore } from "src/store";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export function MatchDialog({ isOpen, onClose }: Props) {
  const navigate = useNavigate();
  const { isInQueue, queueRoomId } = useGlobalStore((state) => {
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
  // useEffect(() => {
  //   if (queueRoomId) {
  //     navigate(`/room/${queueRoomId}`);
  //   }
  // }, [navigate, queueRoomId]);

  // disconnect from queue after 30s
  useEffect(() => {
    if (!isInQueue) {
      return;
    }
    const timeout = setTimeout(() => {
      toast("Timed out from queue :( Please try again!");
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
        {queueRoomId ? (
          <div className="flex flex-col gap-1">
            <p>Room ID: {queueRoomId}</p>
          </div>
        ) : (
          <></>
        )}
        <div className="flex flex-col gap-3">
          {queueRoomId ? (
            <PrimaryButton
              className="w-full"
              onClick={() => navigate(`/room/${queueRoomId}`)}
            >
              Join room
            </PrimaryButton>
          ) : (
            <></>
          )}
          <RedButton className="w-full" onClick={onClose}>
            Disconnect
          </RedButton>
        </div>
      </div>
    </PrimaryDialog>
  );
}
