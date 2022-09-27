import { useEffect, useState } from "react";

import {
  BigHeading,
  PrimaryButton,
  RadioGroupValue,
  SpinnerIcon,
} from "src/components";
import { MatchDialog, QuestionRadioGroup } from "src/dashboard";
import { QuestionDifficulty, useGlobalStore } from "src/store";

const difficultyMap: Record<
  QuestionDifficulty,
  RadioGroupValue<QuestionDifficulty>
> = {
  easy: {
    title: "easy",
    description:
      "Easy questions include simple data structures and concepts such as arrays, strings, and linked lists",
  },
  medium: {
    title: "medium",
    description:
      "Medium questions include somwhat difficult questions such as trees, graphs, and some dynamic programming",
  },
  hard: {
    title: "hard",
    description:
      "Hard questions include more complex algorithms such as binary search, dynamic programming, and graph traversal",
  },
};

const DEFAULT_DIFFICULTY: RadioGroupValue<QuestionDifficulty> =
  difficultyMap.easy;

const Dashboard = () => {
  // store states
  const { user, roomSocket, matchSocket, joinQueue, leaveQueue } =
    useGlobalStore((state) => {
      return {
        user: state.user,
        roomSocket: state.roomSocket,
        matchSocket: state.matchSocket,
        joinQueue: state.joinQueue,
        leaveQueue: state.leaveQueue,
      };
    });
  // page states
  const [isMatchingDialogOpen, setIsMatchingDialogOpen] = useState(false);
  const [difficulty, setDifficulty] =
    useState<RadioGroupValue<QuestionDifficulty>>(DEFAULT_DIFFICULTY);

  const handleJoinQueue = () => {
    setIsMatchingDialogOpen(true);
    joinQueue([difficulty.title]);
  };

  const handleMatchDialogClose = () => {
    if (!user) {
      return;
    }
    console.log("setting matching dialog open to false!!");
    setIsMatchingDialogOpen(false);
    leaveQueue();
  };

  // connects to match and room socket servers
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
      <QuestionRadioGroup
        difficulty={difficulty}
        setDifficulty={setDifficulty}
        difficulties={Object.values(difficultyMap)}
      />
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
