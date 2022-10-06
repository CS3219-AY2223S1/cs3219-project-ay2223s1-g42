import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import shallow from "zustand/shallow";
import { MATCH_EVENTS, QuestionDifficulty } from "g42-peerprep-shared";

import {
  BigHeading,
  PrimaryButton,
  RadioGroupValue,
  SpinnerIcon,
} from "src/components";
import { MatchDialog, QuestionCheckGroup } from "src/features";
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
    description:
      "Challenging data structures and concepts such as trees, graphs, and some dynamic programming",
  },
  hard: {
    title: "hard",
    description:
      "Complex data structures and concepts such as binary search, dynamic programming, and graph traversal",
  },
};

const Dashboard = () => {
  const navigate = useNavigate();
  // store states
  const {
    user,
    queueStatus,
    matchDifficulties,
    setMatchDifficulties,
    joinQueue,
  } = useGlobalStore((state) => {
    return {
      user: state.user,
      queueStatus: state.queueStatus,
      matchDifficulties: state.matchDifficulties,
      setMatchDifficulties: state.setMatchDifficulties,
      joinQueue: state.joinQueue,
    };
  }, shallow);
  // page states
  const [isMatchingDialogOpen, setIsMatchingDialogOpen] = useState(false);

  // handle update selected difficulties
  const handleUpdateDifficulty = (difficulty: QuestionDifficulty) => {
    const difficultySelected = matchDifficulties.includes(difficulty);
    const newDifficulties = difficultySelected
      ? matchDifficulties.filter((d) => d !== difficulty)
      : matchDifficulties.concat(difficulty);
    setMatchDifficulties(newDifficulties);
    setMatchDifficulties(newDifficulties);
  };

  // handle join match queue
  const handleJoinQueue = useCallback(() => {
    setIsMatchingDialogOpen(true);
    joinQueue(matchDifficulties);
  }, [matchDifficulties, joinQueue]);

  const handleMatchDialogClose = () => {
    setIsMatchingDialogOpen(false);
  };

  // find new match if match cancelled
  useEffect(() => {
    if (queueStatus?.event === MATCH_EVENTS.CANCEL_MATCH_SUCCESS) {
      requestAnimationFrame(() => {
        handleMatchDialogClose();
      });
      return;
    }
    if (queueStatus?.event === MATCH_EVENTS.MATCH_CANCELLED) {
      requestAnimationFrame(() => {
        handleJoinQueue();
      });
      return;
    }
  }, [queueStatus?.event, handleJoinQueue]);

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
    <div className="m-auto space-y-12">
      <BigHeading>Welcome to PeerPrep</BigHeading>
      <QuestionCheckGroup
        selectedDifficulties={matchDifficulties}
        updateSelectedValues={handleUpdateDifficulty}
        difficulties={Object.values(difficultyMap)}
      />
      <div className="flex flex-col">
        <PrimaryButton onClick={handleJoinQueue}>Find match</PrimaryButton>
        <MatchDialog
          isOpen={isMatchingDialogOpen}
          onClose={handleMatchDialogClose}
        />
      </div>
    </div>
  );
};

export default Dashboard;
