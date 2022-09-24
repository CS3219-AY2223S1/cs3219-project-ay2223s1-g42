import Editor from "@monaco-editor/react";
import { useEffect } from "react";
import { useParams } from "react-router";

import {
  BaseDropdown,
  BaseListbox,
  LoadingLayout,
  UnauthorizedPage,
} from "src/components";
import { ROOM_EVENTS, useSocketStore } from "src/dashboard";
import { useAuthStore } from "src/hooks";
import { LANGUAGE, RoomTabs, useEditor } from "src/room";

const RoomPage = (): JSX.Element => {
  const { id } = useParams();
  const user = useAuthStore((state) => state.user);
  const { room, roomSocket, status, joinRoom, leaveRoom } = useSocketStore(
    (state) => {
      return {
        room: state.room,
        roomSocket: state.roomSocket,
        status: state.status,
        joinRoom: state.joinRoom,
        leaveRoom: state.leaveRoom,
      };
    }
  );
  const roomId = id ?? "default";
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
  } = useEditor(roomId);

  useEffect(() => {
    // join room on mount
    if (!user) {
      return;
    }
    joinRoom(user, roomId);

    return () => {
      // leave room on unmount
      console.log("leaving room on unmount...");
      leaveRoom(user, roomId);
    };
  }, []);

  if (!provider || !roomSocket) {
    return <LoadingLayout />;
  }

  if (!user) {
    return <UnauthorizedPage />;
  }

  if (status?.event === ROOM_EVENTS.INVALID_ROOM) {
    return (
      <UnauthorizedPage title="Invalid room. Head to the home page and try finding another match!" />
    );
  }

  if (room) {
    return (
      <div className="flex flex-col lg:flex-row gap-3 w-full h-full py-3">
        <div className="w-full h-full max-h-full border-[1px] border-neutral-800">
          <RoomTabs />
        </div>

        <div className="flex flex-col w-full h-full border-neutral-900 border-[1px] bg-blue-500">
          <BaseListbox
            value={language}
            setValue={setLanguage}
            values={Object.values(LANGUAGE)}
          />
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
