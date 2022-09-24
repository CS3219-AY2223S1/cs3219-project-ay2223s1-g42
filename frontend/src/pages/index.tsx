import { useEffect, useState } from "react";

import { BigHeading, PrimaryButton, SpinnerIcon } from "src/components";
import { useAuthStore } from "src/hooks";
import {
  useSocketStore,
  PoolUser,
  MatchDialog,
  QuestionRadioGroup,
} from "src/dashboard";

const Dashboard = () => {
  // store states
  const user = useAuthStore((state) => state.user);
  const { isInQueue, socket, joinQueue, leaveQueue } = useSocketStore(
    (state) => {
      return {
        isInQueue: state.isInQueue,
        socket: state.socket,
        joinQueue: state.joinQueue,
        leaveQueue: state.leaveQueue,
      };
    }
  );
  // page states
  const [isMatchingDialogOpen, setIsMatchingDialogOpen] = useState(false);

  const handleJoinQueue = () => {
    if (!user) {
      console.log("user not found, cannot join queue");
      return;
    }
    const poolUser: PoolUser = {
      ...user,
      difficulties: ["easy", "medium"],
    };
    setIsMatchingDialogOpen(true);
    joinQueue(poolUser);
  };

  const handleMatchDialogClose = () => {
    // if in room, do nothing (user should already be redirected to room)
    if (!isInQueue) {
      return;
    }
    if (!user) {
      return;
    }
    console.log("setting matching dialog open to false!!");
    setIsMatchingDialogOpen(false);
    leaveQueue(user.id);
  };

  useEffect(() => {
    if (user) {
      socket?.connect();
    }
  }, [socket, user]);

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
