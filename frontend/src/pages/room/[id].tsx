import Editor from "@monaco-editor/react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";

import {
  BaseListbox,
  LoadingLayout,
  RedButton,
  UnauthorizedPage,
} from "src/components";
import { ROOM_EVENTS, useSocketStore } from "src/dashboard";
import { useAuthStore } from "src/hooks";
import { LANGUAGE, RoomTabs, useEditor } from "src/room";

const RoomPage = (): JSX.Element => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const { queueRoomId, room, roomSocket, status, joinRoom, leaveRoom } =
    useSocketStore((state) => {
      return {
        queueRoomId: state.queueRoomId,
        room: state.room,
        roomSocket: state.roomSocket,
        status: state.status,
        joinRoom: state.joinRoom,
        leaveRoom: state.leaveRoom,
      };
    });
  const pageRoomId = id ?? "default";
  const isValidRoom = pageRoomId === queueRoomId;
  const {
    doc,
    language,
    setLanguage,
    text,
    binding,
    clients,
    connected,
    input,
    provider,
    handleEditorDidMount,
  } = useEditor(pageRoomId);

  useEffect(() => {
    // join room on mount
    if (!user) {
      return;
    }
    if (!isValidRoom) {
      return;
    }
    joinRoom(user, queueRoomId);

    return () => {
      if (room) {
        // leave room on unmount
        console.log("leaving room on unmount...");
        leaveRoom(user, room.id);
      }
    };
  }, []);

  useEffect(() => {
    console.log({ status });
    if (status?.event === ROOM_EVENTS.LEAVE_ROOM_SUCCESS) {
      navigate("/");
    }
  }, [navigate, status]);

  if (!user) {
    return <UnauthorizedPage />;
  }

  if (
    status?.event === ROOM_EVENTS.INVALID_ROOM ||
    (queueRoomId && !isValidRoom)
  ) {
    provider?.disconnect();
    return (
      <UnauthorizedPage title="Invalid room. Head to the home page and try finding another match!" />
    );
  }

  if (!provider || !roomSocket) {
    return <LoadingLayout />;
  }

  if (room) {
    return (
      <div className="flex flex-col lg:flex-row gap-3 w-full h-full py-3">
        <div className="w-full h-full max-h-full border-[1px] border-neutral-800">
          <RoomTabs />
        </div>

        <div className="flex flex-col w-full h-full border-neutral-900 border-[1px]">
          <div className="flex flex-row items-center justify-between w-full">
            <BaseListbox
              value={language}
              setValue={setLanguage}
              values={Object.values(LANGUAGE)}
            />
            <div>
              <RedButton
                className="py-2 text-sm"
                onClick={() => {
                  if (!queueRoomId) {
                    console.error("no queue room id, cannot leave room");
                    return;
                  }
                  leaveRoom(user, queueRoomId);
                }}
              >
                disconnect
              </RedButton>
            </div>
          </div>
          {!!doc ? (
            <>
              <Editor
                // height="auto"
                defaultLanguage={LANGUAGE.TS}
                language={language}
                value={input}
                theme="vs-dark"
                className="w-full"
                options={{
                  "semanticHighlighting.enabled": true,
                  autoIndent: "full",
                  tabCompletion: "on",
                }}
                // onChange={handleEditorChange}
                onMount={handleEditorDidMount}
              />
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
    );
  }

  return <LoadingLayout />;
};

export default RoomPage;
