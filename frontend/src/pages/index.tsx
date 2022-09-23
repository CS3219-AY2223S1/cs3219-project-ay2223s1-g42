import { useEffect, useState } from "react";

import { PrimaryButton, SpinnerIcon } from "src/components";
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
  const socket = useSocketStore((state) => state.socket);
  const isInQueue = useSocketStore((state) => state.isInQueue);
  const joinQueue = useSocketStore((state) => state.joinQueue);
  const leaveQueue = useSocketStore((state) => state.leaveQueue);
  // page states
  const [isMatchingDialogOpen, setIsMatchingDialogOpen] = useState(false);

  const handleJoinQueue = () => {
    if (!user) {
      console.error("user not found, cannot find match");
      return;
    }
    const poolUser: PoolUser = {
      ...user,
      difficulties: ["easy", "medium"],
    };
    setIsMatchingDialogOpen(true);
    joinQueue(poolUser);
  };

  const handleLeaveQueue = () => {
    if (!user) {
      console.error("user not found, cannot leave match");
      return;
    }
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
    <div className="m-auto space-y-10">
      <h1 className="font-display text-3xl font-semibold md:text-5xl text-neutral-900 text-center">
        Welcome to PeerPrep
      </h1>
      <QuestionRadioGroup />
      <div className="flex flex-col">
        <PrimaryButton onClick={handleJoinQueue}>Match</PrimaryButton>
        <MatchDialog isOpen={isInQueue} onClose={handleLeaveQueue} />
      </div>
    </div>
  );
};

export default Dashboard;
