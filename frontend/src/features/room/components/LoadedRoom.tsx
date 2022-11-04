import { useNavigate } from "react-router";
import shallow from "zustand/shallow";

import { GetSummariesResponse, Room } from "shared/api";
import { Badge, PrimaryButton, RedButton } from "src/components";
import { useGlobalStore } from "src/store";
import { RoomEditor } from "./RoomEditor";
import { RoomListBox } from "./RoomListBox";
import { RoomTabs } from "./RoomTabs";
import { UserStatus } from "./UserStatus";

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
  room,
  questionSummaries,
}: {
  room: Room;
  questionSummaries: GetSummariesResponse;
}) => {
  const { questionIdx, setQuestionIdx } = useGlobalStore((state) => {
    return {
      questionIdx: state.questionIdx,
      setQuestionIdx: state.setQuestionIdx,
    };
  }, shallow);
  const handleSelectNextQuestion = () => {
    const nextQuestionIxd = questionIdx + 1;
    if (nextQuestionIxd > questionSummaries.length - 1) {
      return;
    }
    setQuestionIdx(nextQuestionIxd);
  };
  const handleSelectPreviousQuestion = () => {
    if (!questionSummaries || questionSummaries.length === 0) {
      return;
    }
    const previousQuestionIdx = questionIdx - 1;
    if (previousQuestionIdx < 0) {
      return;
    }
    setQuestionIdx(previousQuestionIdx);
  };
  return (
    <div className="flex h-full w-full flex-col gap-3 py-3 lg:flex-row">
      <div className="flex h-full max-h-full w-full flex-col border-[1px] border-neutral-800">
        <RoomTabs questionSummaries={questionSummaries} />
        <div className="flex flex-col gap-3 border-t-[1px] border-neutral-800 p-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="max-w-full truncate text-lg font-bold">{room.id}</h1>
            <div className="flex flex-row gap-1">
              {room?.difficulties?.map((diff) => (
                <Badge key={`${room.id} ${diff}`}>{diff}</Badge>
              ))}
            </div>
          </div>
          <div className="flex flex-col justify-start gap-1 truncate">
            {room.users.map((user) => (
              <UserStatus key={user.id} user={user} />
            ))}
          </div>
        </div>
        <div className="flex flex-row items-center justify-between border-t-[1px] border-neutral-800 p-3">
          <PrimaryButton
            className="px-6 py-2.5"
            onClick={handleSelectPreviousQuestion}
          >
            Back
          </PrimaryButton>
          <span>
            {questionIdx + 1}/{questionSummaries.length}
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
