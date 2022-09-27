import { useEffect, useState } from "react";

import { BigHeading, PrimaryButton, SpinnerIcon } from "src/components";
import { MatchDialog, QuestionRadioGroup } from "src/dashboard";
import { useGlobalStore } from "src/store";

const Dashboard = () => {
  // store states
  const user = useGlobalStore((state) => state.user);
  const { roomSocket, matchSocket, joinQueue, leaveQueue } = useGlobalStore(
    (state) => {
      return {
        roomSocket: state.roomSocket,
        matchSocket: state.matchSocket,
        joinQueue: state.joinQueue,
        leaveQueue: state.leaveQueue,
      };
    }
  );
  // page states
  const [isMatchingDialogOpen, setIsMatchingDialogOpen] = useState(false);

  const handleJoinQueue = () => {
    setIsMatchingDialogOpen(true);
    joinQueue(["easy", "medium"]);
  };

  const handleMatchDialogClose = () => {
    if (!user) {
      return;
    }
    console.log("setting matching dialog open to false!!");
    setIsMatchingDialogOpen(false);
    leaveQueue();
  };

  useEffect(() => {
    if (!matchSocket) {
      console.error(
        "failed to connect to match socket server, match socket not set"
      );
      return;
    }
    if (!roomSocket) {
      console.error(
        "failed to connect to room socket server, room socket not set"
      );
      return;
    }
    if (!user) {
      console.error("failed to connect to socket servers, user not logged in");
      return;
    }
    matchSocket.connect();
    roomSocket.connect();
  }, []);

  if (!user) {
    return <SpinnerIcon className="h-12 w-12" />;
  }
  return (
    <div className="m-auto space-y-8">
      <BigHeading>Welcome to PeerPrep</BigHeading>
      <QuestionRadioGroup />
      <div className="flex flex-col">
        <PrimaryButton onClick={handleJoinQueue}>Match</PrimaryButton>
        <MatchDialog
          isOpen={isMatchingDialogOpen}
          onClose={handleMatchDialogClose}
        />
      </div>
    </div>
  );
};

export default Dashboard;
