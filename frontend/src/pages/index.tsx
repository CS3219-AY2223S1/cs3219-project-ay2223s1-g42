import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import shallow from "zustand/shallow";

import { MATCH_EVENTS, QuestionDifficulty } from "shared/api";
import {
  BigHeading,
  PrimaryButton,
  RadioGroupValue,
  SpinnerIcon,
} from "src/components";
import { MatchDialog, QuestionRadioGroup } from "src/features";
import { useGlobalStore } from "src/store";

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
    room,
    queueRoomId,
    isInQueue,
    queueStatus,
    setMatchDifficulties,
    joinQueue,
    leaveQueue,
    leaveRoom,
    cancelMatch,
  } = useGlobalStore((state) => {
    return {
      user: state.user,
      room: state.room,
      queueRoomId: state.queueRoomId,
      isInQueue: state.isInQueue,
      queueStatus: state.queueStatus,
      setMatchDifficulties: state.setMatchDifficulties,
      joinQueue: state.joinQueue,
      leaveQueue: state.leaveQueue,
      leaveRoom: state.leaveRoom,
      cancelMatch: state.cancelMatch,
    };
  }, shallow);
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

  const handleMatchDialogClose = () => {
    setIsMatchingDialogOpen(false);
  };

  // close dialog if match cancel event received
  useEffect(() => {
    if (queueStatus?.event === MATCH_EVENTS.CANCEL_MATCH_SUCCESS) {
      handleMatchDialogClose();
    }
  }, [queueStatus?.event]);

  // redirect to login page if user not logged in
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

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
