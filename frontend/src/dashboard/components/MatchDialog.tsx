import { useNavigate } from "react-router";

import { RedButton, PrimaryDialog, PrimaryButton } from "src/components";
import { useGlobalStore } from "src/store";
import { MatchCountdownTimer } from "./MatchCountdownTimer";

const MATCH_QUEUE_DURATION = 30;
const MATCH_FOUND_DURATION = 10;

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const MatchDialog = ({ isOpen, onClose }: Props) => {
  const navigate = useNavigate();
  const { isInQueue, queueRoomId, leaveRoom } = useGlobalStore((state) => {
    return {
      isInQueue: state.isInQueue,
      queueRoomId: state.queueRoomId,
      leaveRoom: state.leaveRoom,
    };
  });

  const dialogTitle = queueRoomId ? "Match Found" : "Matching you now...";
  const dialogDescription = queueRoomId
    ? "You have been matched with a peer! Join the room now to start coding :)"
    : "Please hold while we search for a compatible match...";

  const handleDisconnect = () => {
    onClose();
    if (!isInQueue) {
      leaveRoom();
    }
  };

  return (
    <PrimaryDialog
      isOpen={isOpen}
      onClose={onClose}
      title={dialogTitle}
      description={dialogDescription}
    >
      <div className="flex flex-col gap-6">
        <div className="flex w-full items-center justify-center">
          {queueRoomId ? (
            <MatchCountdownTimer
              duration={MATCH_FOUND_DURATION}
              isPlaying={!!queueRoomId}
              key={"match-found-timer"}
              onComplete={handleDisconnect}
            />
          ) : isInQueue ? (
            <MatchCountdownTimer
              duration={MATCH_QUEUE_DURATION}
              isPlaying={isInQueue}
              key={"match-queue-timer"}
              onComplete={handleDisconnect}
            />
          ) : (
            <></>
          )}
        </div>

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
          <RedButton className="w-full" onClick={handleDisconnect}>
            Disconnect
          </RedButton>
        </div>
      </div>
    </PrimaryDialog>
  );
};

export { MatchDialog };
