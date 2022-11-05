import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import shallow from "zustand/shallow";
import { useQuery } from "@tanstack/react-query";

import {
  GetDailyQuestionSummaryResponse,
  GetSummariesResponse,
  MatchType,
  MATCH_EVENTS,
  ROOM_EVENTS,
} from "shared/api";
import { LoadingLayout, UnauthorizedPage } from "src/components";
import { LoadedRoom } from "src/features";
import { useGlobalStore } from "src/store";
import { Axios } from "src/services";

const RoomPage = (): JSX.Element => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    user,
    queueRoomId,
    room,
    roomStatus,
    queueStatus,
    joinRoom,
    resetProviderBinding,
  } = useGlobalStore((state) => {
    return {
      user: state.user,
      queueRoomId: state.queueRoomId,
      room: state.room,
      roomStatus: state.roomStatus,
      queueStatus: state.queueStatus,
      joinRoom: state.joinRoom,
      resetProviderBinding: state.resetProviderBinding,
    };
  }, shallow);

  const pageRoomId = id ?? "default";
  const isQueuedRoom = pageRoomId === queueRoomId;
  const isInvalidRoom =
    roomStatus?.event === ROOM_EVENTS.INVALID_ROOM ||
    (queueRoomId && !isQueuedRoom);

  const questionSummaries = useQuery(
    ["room-question-summaries", pageRoomId],
    () => {
      if (room?.type === MatchType.DIFFICULTY && room?.difficulties) {
        return Axios.get<GetSummariesResponse>(
          `/question/summary?difficulty=${room?.difficulties.join(",")}`
        ).then((res) => res.data);
      }

      if (room?.type === MatchType.TOPICS && room?.topics) {
        return Axios.get<GetSummariesResponse>(
          `/question/summary?topicTags=${room?.topics.join(",")}`
        ).then((res) => res.data);
      }

      if (room?.type === MatchType.QOTD) {
        return Axios.get<GetDailyQuestionSummaryResponse>(
          "/question/summary/daily"
        ).then((res) => [res.data]);
      }
    }
  );
  console.log(questionSummaries.data);

  // join room on mount
  useEffect(() => {
    // only attempt to join room if user logged in and has not joined a room
    if (!user || (queueRoomId && !isQueuedRoom) || room) {
      return;
    }
    joinRoom(pageRoomId);
  }, []);

  // redirect to dashboard page if match cancelled
  useEffect(() => {
    if (
      queueStatus?.event === MATCH_EVENTS.CANCEL_MATCH_SUCCESS ||
      queueStatus?.event === MATCH_EVENTS.MATCH_CANCELLED
    ) {
      navigate("/");
      resetProviderBinding();
    }
  }, [queueStatus?.event, navigate, resetProviderBinding]);

  if (isInvalidRoom) {
    return (
      <UnauthorizedPage title="Unauthorized room. Try finding another match instead!" />
    );
  }

  if (!user) {
    return <UnauthorizedPage />;
  }

  if (room && questionSummaries.data) {
    return (
      <LoadedRoom room={room} questionSummaries={questionSummaries.data} />
    );
  }

  return <LoadingLayout />;
};

export default RoomPage;
