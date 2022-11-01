import { useNavigate } from "react-router";
import shallow from "zustand/shallow";
import { useQuery } from "@tanstack/react-query";

import { GetSummariesResponse, Room } from "shared/api";
import { LoadingLayout, PrimaryButton, RedButton } from "src/components";
import { useGlobalStore } from "src/store";
import { RoomEditor } from "./RoomEditor";
import { RoomListBox } from "./RoomListBox";
import { RoomTabs } from "./RoomTabs";
import { Axios } from "src/services";
import { useState } from "react";

const LeaveRoomButton = () => {
  const navigate = useNavigate();
  const { user, leaveRoom } = useGlobalStore((state) => {
    return {
      user: state.user,
      leaveRoom: state.leaveRoom,
    };
  }, shallow);
  return (
    <RedButton
      className="border-[1px] border-l-neutral-900 py-2.5 md:py-2"
      onClick={() => {
        if (!user) {
          console.error("user not logged in, cannot leave room");
          return;
        }
        leaveRoom();
        navigate("/");
      }}
    >
      disconnect
    </RedButton>
  );
};

const LoadedRoom = ({
  questionSummaries,
}: {
  questionSummaries: GetSummariesResponse;
}) => {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const handleSelectNextQuestion = () => {
    if (currentQuestionIdx + 1 > questionSummaries.length) {
      return;
    }
    setCurrentQuestionIdx((qid) => qid + 1);
  };
  const handleSelectPreviousQuestion = () => {
    if (!questionSummaries) {
      return;
    }
    if (currentQuestionIdx - 1 < 0) {
      return;
    }
    setCurrentQuestionIdx((qid) => qid - 1);
  };
  return (
    <div className="flex h-full w-full flex-col gap-3 py-3 lg:flex-row">
      <div className="flex h-full max-h-full w-full flex-col border-[1px] border-neutral-800">
        <RoomTabs
          questionIdx={currentQuestionIdx}
          questionSummaries={questionSummaries}
        />
        <div className="flex flex-row items-center justify-between border-t-[1px] border-neutral-800 p-2">
          <PrimaryButton
            className="px-6 py-2.5"
            onClick={handleSelectPreviousQuestion}
          >
            Back
          </PrimaryButton>
          <span>
            {currentQuestionIdx + 1}/{questionSummaries.length}
          </span>
          <PrimaryButton
            className="px-6 py-2.5"
            onClick={handleSelectNextQuestion}
          >
            Next
          </PrimaryButton>
        </div>
      </div>
      <div className="flex h-full w-full flex-col border-[1px] border-neutral-900">
        <div className="flex w-full flex-row items-center justify-between">
          <RoomListBox />
          <LeaveRoomButton />
        </div>
        <RoomEditor />
      </div>
    </div>
  );
};

export { LoadedRoom };
