import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useSearchParams } from "react-router-dom";
import shallow from "zustand/shallow";
import { Portal } from "@headlessui/react";
import cx from "classnames";

import { GetSummariesResponse, Room } from "shared/api";
import {
  PrimaryBadge,
  PrimaryButton,
  RedButton,
  SpinnerIcon,
} from "src/components";
import { useGlobalStore } from "src/store";
import { RoomEditor } from "./RoomEditor";
import { RoomListBox } from "./RoomListBox";
import { RoomTabs } from "./RoomTabs";
import { UserStatus } from "./UserStatus";
import { SaveAttemptButton } from "./SaveAttemptButton";
import { SoloEditor } from "./SoloEditor";

const LeaveRoomButton = () => {
  const navigate = useNavigate();
  const { user, leaveRoom, leaveCall } = useGlobalStore((state) => {
    return {
      user: state.user,
      leaveRoom: state.leaveRoom,
      leaveCall: state.leaveCall,
    };
  }, shallow);
  return (
    <RedButton
      className="border-[1px] py-2.5 md:border-l-neutral-900 md:py-2"
      onClick={() => {
        if (!user) {
          console.error("user not logged in, cannot leave room");
          return;
        }
        leaveCall();
        leaveRoom();
        navigate("/");
      }}
    >
      disconnect
    </RedButton>
  );
};

type RoomUserVideoProps = {
  isConnected: boolean;
  children: React.ReactNode;
  isRightBorder?: boolean;
  isHidden?: boolean;
};

const RoomUserVideo = ({
  isConnected,
  children,
  isRightBorder,
  isHidden,
}: RoomUserVideoProps) => {
  return (
    <div
      className={cx(
        "relative h-20 w-[106px] bg-neutral-800 md:h-40 md:w-[213px]",
        {
          "md:border-r-neutral-900, md:border-r-[1px]": isRightBorder,
          hidden: isHidden,
        }
      )}
    >
      {!isConnected ? (
        <SpinnerIcon className="absolute top-0 left-0 right-0 bottom-0 m-auto h-6 w-6" />
      ) : (
        <></>
      )}
      {children}
    </div>
  );
};

const RoomInfo = ({ room }: { room: Room }) => {
  return (
    <div className="flex flex-col gap-3 border-t-[1px] border-neutral-800 p-3 xl:flex-row xl:items-center xl:justify-between">
      <div className="flex flex-col gap-2">
        <h1 className="max-w-full truncate text-lg font-bold">{room?.id}</h1>
        <div className="flex flex-row gap-1">
          {room?.difficulties?.map((diff) => (
            <PrimaryBadge key={`${room.id} ${diff}`}>{diff}</PrimaryBadge>
          ))}
        </div>
      </div>
      <div className="flex flex-col justify-start gap-1 truncate">
        {room?.users.map((user) => (
          <UserStatus key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
};

const LoadedRoom = ({
  room,
  questionSummaries,
}: {
  room?: Room;
  questionSummaries: GetSummariesResponse;
}) => {
  const {
    user,
    questionIdx,
    setQuestionIdx,
    setupVideo,
    myVideoRef,
    myVideoConnected,
    otherVideoRef,
    otherVideoConnected,
    stream,
    isCaller,
    callUser,
    setInput,
  } = useGlobalStore((state) => {
    return {
      user: state.user,
      questionIdx: state.questionIdx,
      setQuestionIdx: state.setQuestionIdx,
      setupVideo: state.setupVideo,
      myVideoRef: state.myVideo,
      myVideoConnected: state.myVideoConnected,
      otherVideoRef: state.otherVideo,
      otherVideoConnected: state.otherVideoConnected,
      stream: state.stream,
      isCaller: state.isCaller,
      callUser: state.callUser,
      setInput: state.setEditorInput,
    };
  }, shallow);
  const [searchParams, setSearchParams] = useSearchParams();
  const slug = searchParams.get("slug");

  // if valid slug provided, update qn idx
  if (slug) {
    const slugQnIdx = questionSummaries.findIndex((q) => q.titleSlug === slug);
    if (slugQnIdx !== -1) {
      setQuestionIdx(slugQnIdx);
    }
  }

  // get current question summary (use slug to filter if solo editor, otherwise use questionIdx, fallback on first qn)
  const questionSummary = slug
    ? questionSummaries.find((q) => q.titleSlug === slug) ??
      questionSummaries[questionIdx] ??
      questionSummaries[0]
    : questionSummaries[questionIdx] ?? questionSummaries[0];

  const handleSelectNextQuestion = () => {
    const nextQuestionIdx = questionIdx + 1;
    if (nextQuestionIdx > questionSummaries.length - 1) {
      return;
    }
    setQuestionIdx(nextQuestionIdx);
    // only update slug if already exists
    if (slug) {
      const nextSlug = questionSummaries[nextQuestionIdx].titleSlug;
      setSearchParams({ slug: nextSlug });
    }
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
    // only update slug if already exists
    if (slug) {
      const prevSlug = questionSummaries[previousQuestionIdx].titleSlug;
      setSearchParams({
        slug: prevSlug,
      });
    }
  };

  // set up video if room editor
  useEffect(() => {
    if (!room) {
      return;
    }
    setupVideo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // update initial slug if solo editor and no slug provided
  useEffect(() => {
    if (!slug && !room) {
      setSearchParams({ slug: questionSummary.titleSlug });
    }
  }, []);

  // set up video if room editor
  useEffect(() => {
    if (!room?.id) {
      return;
    }
    const otherUser = room?.users.find((u) => u.id !== user?.id);
    if (otherUser && isCaller) {
      callUser(otherUser.socketId);
    }
  }, [callUser, isCaller, room?.users, user?.id, stream, room?.id]);

  // reset editor input on qn change if solo editor
  useEffect(() => {
    if (room?.id) {
      return;
    }
    setInput(undefined);
  }, [questionIdx, room?.id, setInput]);

  return (
    <div className="relative flex h-full w-full flex-col gap-3 py-3 lg:flex-row">
      {room ? (
        <Portal>
          <div className="fixed bottom-0 right-0 z-[999] flex w-fit flex-col border-[1px] border-neutral-900 md:flex-row">
            <RoomUserVideo
              isConnected={otherVideoConnected}
              isRightBorder={true}
              isHidden={!otherVideoConnected}
            >
              <video
                className="h-full w-full"
                playsInline
                ref={otherVideoRef}
                autoPlay
              />
            </RoomUserVideo>
            <RoomUserVideo isConnected={myVideoConnected}>
              <video
                className="h-full w-full"
                playsInline
                ref={myVideoRef}
                autoPlay
                muted={true}
              />
            </RoomUserVideo>
          </div>
        </Portal>
      ) : (
        <></>
      )}
      <div className="flex h-full max-h-full w-full flex-col border-[1px] border-neutral-800">
        <RoomTabs questionSummary={questionSummary} />
        {room ? <RoomInfo room={room} /> : <></>}
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
        <div className="flex w-full flex-col items-center gap-1 md:flex-row md:justify-between">
          <RoomListBox />
          {room ? (
            <div className="flex w-full flex-row gap-2 p-2 md:w-auto md:flex-row md:gap-0 md:p-0">
              <SaveAttemptButton questionSummary={questionSummary} />
              <LeaveRoomButton />
            </div>
          ) : (
            <></>
          )}
        </div>
        {room ? <RoomEditor /> : <SoloEditor />}
      </div>
    </div>
  );
};

export { LoadedRoom };
