import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import shallow from "zustand/shallow";

import { MatchType, MATCH_EVENTS, QuestionDifficulty } from "shared/api";
import {
  BigHeading,
  PrimaryButton,
  RadioGroupValue,
  SpinnerIcon,
} from "src/components";
import {
  MatchDialog,
  QuestionCheckGroup,
  MatchTypeRadioGroup,
} from "src/features";
import { matchToastOptions, useGlobalStore } from "src/store";
import toast from "react-hot-toast";

const tempDesign = "";

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

const matchMap: Record<MatchType, RadioGroupValue<MatchType>> = {
  difficulty: {
    title: "difficulty",
    description:
      "Simple data structures and concepts such as arrays, strings, and linked lists",
  },
  qotd: {
    title: "qotd",
    description:
      "Challenging data structures and concepts such as trees, graphs, and some dynamic programming",
  },
  topics: {
    title: "topics",
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
    matchSocket,
    matchType,
    roomSocket,
    setMatchDifficulties,
    setMatchTypes,
    joinQueue,
  } = useGlobalStore((state) => {
    return {
      user: state.user,
      queueStatus: state.queueStatus,
      matchDifficulties: state.matchDifficulties,
      matchSocket: state.matchSocket,
      matchType: state.matchType,
      roomSocket: state.roomSocket,
      setMatchDifficulties: state.setMatchDifficulties,
      setMatchTypes: state.setMatchTypes,
      joinQueue: state.joinQueue,
    };
  }, shallow);
  // page states
  const [isMatchingDialogOpen, setIsMatchingDialogOpen] = useState(false);
  const [isDifficultySelected, setDifficultySelected] = useState(false);
  const [isQotdSelected, setQotdSelected] = useState(false);
  const [isTopicsSelected, setTopicsSelected] = useState(false);
  const [isMatchTypeSelected, setMatchTypeSelected] = useState(false);

  const handleDifficultyClick = () => {
    setDifficultySelected(true);
    setMatchTypeSelected(true);
  };

  const handleQotdClick = () => {
    setQotdSelected(true);
    setMatchTypeSelected(true);
  };

  const handleTopicsClick = () => {
    setTopicsSelected(true);
    setMatchTypeSelected(true);
  };

  // handle update selected difficulties
  const handleUpdateDifficulty = (difficulty: QuestionDifficulty) => {
    const difficultySelected = matchDifficulties.includes(difficulty);
    // if diffuculty already selected, unselect it, otherwise select it
    const newDifficulties = difficultySelected
      ? matchDifficulties.filter((d) => d !== difficulty)
      : matchDifficulties.concat(difficulty);
    // prevent user from unselecting difficulty if it's the only one selected
    if (newDifficulties.length === 0) {
      return;
    }
    setMatchDifficulties(newDifficulties);
  };

  // handle join match queue
  const handleJoinQueue = useCallback(() => {
    if (!roomSocket?.connected || !matchSocket?.connected) {
      toast.error("Unable to connect to server. Please try again later.", {
        id: "join-queue-error",
      });
      return;
    }
    setIsMatchingDialogOpen(true);
    joinQueue(matchDifficulties);
  }, [
    roomSocket?.connected,
    matchSocket?.connected,
    joinQueue,
    matchDifficulties,
  ]);

  const handleMatchDialogClose = () => {
    setIsMatchingDialogOpen(false);
  };

  const [selectedRadioBtn, setSelectedBtn] = React.useState("radio");

  const isRadioSelected = (value: string): boolean => selectedRadioBtn == value;

  const handleRadioClick = (e: React.ChangeEvent<HTMLInputElement>): void =>
    setSelectedBtn(e.currentTarget.value);

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

  const selectMatchTypePage = (
    <div className="inline-flex rounded-md shadow-sm">
      <button onClick={handleDifficultyClick}>
        <a
          aria-current="page"
          className="rounded-l-lg border border-gray-200 bg-white py-2 px-4 text-sm font-medium text-blue-700 focus:z-10 focus:text-blue-700 focus:ring-2 focus:ring-blue-700 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:text-white dark:focus:ring-blue-500 dark:hover:bg-gray-600 dark:hover:text-white"
        >
          Match By Difficulty
        </a>
      </button>
      <button onClick={handleQotdClick}>
        <a className="border-t border-b border-gray-200 bg-white py-2 px-4 text-sm font-medium text-gray-900 focus:z-10 focus:text-blue-700 focus:ring-2 focus:ring-blue-700 hover:bg-gray-100 hover:text-blue-700 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:text-white dark:focus:ring-blue-500 dark:hover:bg-gray-600 dark:hover:text-white">
          Match By Qotd
        </a>
      </button>
      <button onClick={handleTopicsClick}>
        <a className="rounded-r-md border border-gray-200 bg-white py-2 px-4 text-sm font-medium text-gray-900 focus:z-10 focus:text-blue-700 focus:ring-2 focus:ring-blue-700 hover:bg-gray-100 hover:text-blue-700 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:text-white dark:focus:ring-blue-500 dark:hover:bg-gray-600 dark:hover:text-white">
          Match By topics
        </a>
      </button>
    </div>
  );

  return (
    <div className="m-auto space-y-12">
      <BigHeading>Welcome to PeerPrep</BigHeading>
      {isMatchTypeSelected ? <div>Cunt</div> : selectMatchTypePage}
    </div>
  );
};

export default Dashboard;
/* 
      <MatchTypeRadioGroup
        selectedType={matchType}
        setType={handleSetMatchType}
        types={Object.values(matchMap)}
      />
*/
/*
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


*/
