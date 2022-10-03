import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

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
      "Simple data structures and concepts such as arrays, strings, and linked lists",
  },
  medium: {
    title: "medium",
    description: "Trees, graphs, and some dynamic programming",
  },
  hard: {
    title: "hard",
    description: "Binary search, dynamic programming, and graph traversal",
  },
};

const DEFAULT_DIFFICULTY: RadioGroupValue<QuestionDifficulty> =
  difficultyMap.easy;

const Dashboard = () => {
  const navigate = useNavigate();
  // store states
  const {
    user,
    isInQueue,
    roomSocket,
    matchSocket,
    setMatchDifficulties,
    joinQueue,
    leaveQueue,
  } = useGlobalStore((state) => {
    return {
      user: state.user,
      isInQueue: state.isInQueue,
      roomSocket: state.roomSocket,
      matchSocket: state.matchSocket,
      setMatchDifficulties: state.setMatchDifficulties,
      joinQueue: state.joinQueue,
      leaveQueue: state.leaveQueue,
    };
  });
  // page states
  const [isMatchingDialogOpen, setIsMatchingDialogOpen] = useState(false);
  const [difficulty, setDifficulty] =
    useState<RadioGroupValue<QuestionDifficulty>>(DEFAULT_DIFFICULTY);

  // handle set difficulty
  const handleSetDifficulty = (value: RadioGroupValue<QuestionDifficulty>) => {
    setDifficulty(value);
    setMatchDifficulties([value.title]);
  };

  // handle join match queue
  const handleJoinQueue = () => {
    setIsMatchingDialogOpen(true);
    joinQueue([difficulty.title]);
  };

  // handle leave match qeueue
  const handleMatchDialogClose = () => {
    setIsMatchingDialogOpen(false);
    // if not matched, leave queue
    if (!isInQueue) {
      return;
    }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (!user) {
    return <SpinnerIcon className="h-12 w-12" />;
  }

  return (
    <div className="m-auto space-y-8">
      <BigHeading>Welcome to PeerPrep</BigHeading>
      <QuestionRadioGroup
        difficulty={difficulty}
        setDifficulty={handleSetDifficulty}
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
