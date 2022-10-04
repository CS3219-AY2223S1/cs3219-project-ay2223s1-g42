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
import {
  MatchDialog,
  QuestionCheckGroup,
  QuestionRadioGroup,
} from "src/features";
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

const DEFAULT_DIFFICULTY: QuestionDifficulty = difficultyMap.easy.title;

const Dashboard = () => {
  const navigate = useNavigate();
  // store states
  const { user, queueStatus, setMatchDifficulties, joinQueue } = useGlobalStore(
    (state) => {
      return {
        user: state.user,
        queueStatus: state.queueStatus,
        setMatchDifficulties: state.setMatchDifficulties,
        joinQueue: state.joinQueue,
      };
    },
    shallow
  );
  // page states
  const [isMatchingDialogOpen, setIsMatchingDialogOpen] = useState(false);
  const [selectedDifficulties, setSelectedDifficulties] = useState<
    QuestionDifficulty[]
  >([DEFAULT_DIFFICULTY]);

  // handle set difficulty
  const handleUpdateDifficulty = (difficulty: QuestionDifficulty) => {
    const difficultySelected = selectedDifficulties.includes(difficulty);
    const newDifficulties = difficultySelected
      ? selectedDifficulties.filter((d) => d !== difficulty)
      : selectedDifficulties.concat(difficulty);
    setSelectedDifficulties(newDifficulties);
    setMatchDifficulties(newDifficulties);
  };

  // handle join match queue
  const handleJoinQueue = () => {
    setIsMatchingDialogOpen(true);
    joinQueue(selectedDifficulties);
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
    <div className="m-auto space-y-12">
      <BigHeading>Welcome to PeerPrep</BigHeading>
      <QuestionCheckGroup
        selectedDifficulties={selectedDifficulties}
        updateSelectedValues={handleUpdateDifficulty}
        difficulties={Object.values(difficultyMap)}
      />
      {/* <QuestionRadioGroup
        difficulty={difficulty}
        setDifficulty={handleSetDifficulty}
        difficulties={Object.values(difficultyMap)}
      /> */}
      <div className="flex flex-col">
        <PrimaryButton onClick={handleJoinQueue}>Find match!</PrimaryButton>
        <MatchDialog
          isOpen={isMatchingDialogOpen}
          onClose={handleMatchDialogClose}
        />
      </div>
    </div>
  );
};

export default Dashboard;
