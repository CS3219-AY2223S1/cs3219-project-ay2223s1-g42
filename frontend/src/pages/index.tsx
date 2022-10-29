import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import shallow from "zustand/shallow";
import toast from "react-hot-toast";

import { MatchType, MATCH_EVENTS, QuestionDifficulty } from "shared/api";
import { BigHeading, PrimaryButton, SpinnerIcon } from "src/components";
import {
  MatchDialog,
  QuestionCheckGroup,
  MatchTypeRadioGroup,
  MatchByTopics,
  TopicListBox,
} from "src/features";
import { useGlobalStore } from "src/store";

enum PageStep {
  FIRST = 1,
  SECOND = 2,
}

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
    setMatchType,
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
      setMatchType: state.setMatchType,
      joinQueue: state.joinQueue,
    };
  }, shallow);
  // page states
  const [isMatchingDialogOpen, setIsMatchingDialogOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<PageStep>(PageStep.FIRST);

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
      {/* Second step */}
      {currentStep === PageStep.SECOND ? (
        <div className="m-auto space-y-12">
          {matchType === MatchType.DIFFICULTY ? (
            <QuestionCheckGroup
              selectedDifficulties={matchDifficulties}
              updateSelectedValues={handleUpdateDifficulty}
            />
          ) : matchType === MatchType.TOPICS ? (
            // <MatchByTopics />
            <TopicListBox />
          ) : (
            <></>
          )}
          <div className="flex flex-col gap-2">
            <PrimaryButton onClick={handleJoinQueue}>Find match</PrimaryButton>
            <PrimaryButton
              onClick={() => {
                setMatchType(undefined);
                setCurrentStep(PageStep.FIRST);
              }}
            >
              Back
            </PrimaryButton>
          </div>
        </div>
      ) : (
        <>
          {/* First step */}
          <MatchTypeRadioGroup type={matchType} setType={setMatchType} />
          <div className="flex flex-col">
            <PrimaryButton
              onClick={() => {
                if (!matchType) {
                  return;
                }
                if (matchType === MatchType.QOTD) {
                  handleJoinQueue();
                  return;
                }
                setCurrentStep(PageStep.SECOND);
              }}
            >
              {matchType === MatchType.DIFFICULTY
                ? "Select difficulty"
                : matchType === MatchType.TOPICS
                ? "Select topics"
                : "Find match"}
            </PrimaryButton>
          </div>
        </>
      )}
      <MatchDialog
        isOpen={isMatchingDialogOpen}
        onClose={handleMatchDialogClose}
      />
    </div>
  );
};

export default Dashboard;
