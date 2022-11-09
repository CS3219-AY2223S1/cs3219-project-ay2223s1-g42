import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import shallow from "zustand/shallow";

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
  const {
    isInQueue,
    queueRoomId,
    room,
    joinRoom,
    leaveRoom,
    leaveQueue,
    cancelMatch,
  } = useGlobalStore((state) => {
    return {
      isInQueue: state.isInQueue,
      queueRoomId: state.queueRoomId,
      room: state.room,
      joinRoom: state.joinRoom,
      leaveRoom: state.leaveRoom,
      leaveQueue: state.leaveQueue,
      cancelMatch: state.cancelMatch,
    };
  }, shallow);
  const [joinLoading, setJoinLoading] = useState<boolean>(false);

  const dialogTitle = room
    ? "Already in a room!"
    : queueRoomId
    ? "Match Found"
    : "Matching you now...";

  const dialogDescription = room
    ? "Please leave your room to find another match!"
    : queueRoomId
    ? "You have been matched with a peer! Join the room now to start coding :)"
    : "Please hold while we search for a compatible match...";

  const handleJoinRoom = (roomId: string) => {
    setJoinLoading(true);
    joinRoom(roomId);
  };

  const handleLeaveQueue = () => {
    leaveQueue();
    onClose();
  };

  const handleCancelMatch = () => {
    cancelMatch();
    onClose();
  };

  const handleLeaveRoom = () => {
    leaveRoom();
    onClose();
  };

  useEffect(() => {
    if (isOpen && room && joinLoading) {
      setJoinLoading(false);
      navigate(`/room/${room.id}`);
      return;
    }
  }, [isOpen, room, joinLoading, navigate]);

  return (
    <PrimaryDialog
      isOpen={isOpen}
      onClose={onClose}
      title={dialogTitle}
      description={dialogDescription}
      autoClose={false}
    >
      <div className="flex flex-col gap-6">
        {room ? (
          <>
            <div className="flex flex-col gap-1">
              <p>Room ID: {room.id}</p>
            </div>
            <div className="flex flex-col gap-2.5">
              <PrimaryButton
                className="w-full"
                onClick={() => navigate(`/room/${room.id}`)}
              >
                Return to room
              </PrimaryButton>
              <RedButton className="w-full" onClick={handleLeaveRoom}>
                Disconnect
              </RedButton>
            </div>
          </>
        ) : queueRoomId ? (
          <>
            <div className="flex w-full items-center justify-center">
              <MatchCountdownTimer
                duration={MATCH_FOUND_DURATION}
                isPlaying={!!queueRoomId}
                key={"match-found-timer"}
                onComplete={handleCancelMatch}
              />
            </div>
            <div className="flex flex-col gap-1">
              <p>Room ID: {queueRoomId}</p>
            </div>
            <div className="flex flex-col gap-2.5">
              <PrimaryButton
                className="w-full"
                onClick={() => handleJoinRoom(queueRoomId)}
              >
                Join room
              </PrimaryButton>
              <RedButton className="w-full" onClick={handleCancelMatch}>
                Disconnect
              </RedButton>
            </div>
          </>
        ) : isInQueue ? (
          <>
            <div className="flex w-full items-center justify-center">
              <MatchCountdownTimer
                duration={MATCH_QUEUE_DURATION}
                isPlaying={isInQueue}
                key={"match-queue-timer"}
                onComplete={handleLeaveQueue}
              />
            </div>
            <RedButton className="w-full" onClick={handleLeaveQueue}>
              Disconnect
            </RedButton>
          </>
        ) : (
          <></>
        )}
      </div>
    </PrimaryDialog>
  );
};

export { MatchDialog };
