import Editor from "@monaco-editor/react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import * as monaco from "monaco-editor";

import {
  BaseListbox,
  LoadingLayout,
  RedButton,
  UnauthorizedPage,
} from "src/components";
import { ROOM_EVENTS, useSocketStore } from "src/dashboard";
import { useAuthStore } from "src/hooks";
import { LANGUAGE, RoomTabs, useEditorStore } from "src/room";

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
  const {
    input,
    language,
    editor,
    doc,
    text,
    binding,
    clients,
    connected,
    provider,
    setLanguage,
    setup,
    cleanup,
  } = useEditorStore((state) => {
    return {
      input: state.input,
      language: state.language,
      editor: state.editor,
      doc: state.doc,
      text: state.text,
      binding: state.binding,
      clients: state.clients,
      connected: state.connected,
      provider: state.provider,
      setLanguage: state.setLanguage,
      setup: state.setup,
      cleanup: state.cleanup,
    };
  });

  const pageRoomId = id ?? "default";
  const isValidRoom = pageRoomId === queueRoomId;

  const handleEditorDidMount = (
    editor: monaco.editor.IStandaloneCodeEditor
  ) => {
    console.log("setting up editor...");
    if (!user) {
      console.error("user not logged in, failed to set up editor");
      return;
    }
    if (!pageRoomId) {
      console.error("no room id provided, failed to set up editor");
      return;
    }
    setup(editor, user, pageRoomId);
  };

  useEffect(() => {
    // join room on mount
    if (!user) {
      return;
    }
    if (queueRoomId && !isValidRoom) {
      return;
    }
    console.log("joing room: ", { user, pageRoomId });
    joinRoom(user, pageRoomId);

    return () => {
      cleanup();
    };
  }, []);

  useEffect(() => {
    console.log({ status });
    if (status?.event === ROOM_EVENTS.LEAVE_ROOM_SUCCESS) {
      console.log("successfully left room, redirecting to dashboard page...");
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
              setValue={(value) => setLanguage(value as LANGUAGE)}
              values={Object.values(LANGUAGE)}
            />
            <div>
              <RedButton
                className="py-2 text-sm"
                onClick={() => {
                  if (!room) {
                    console.error("no room state set, cannot leave room");
                    return;
                  }
                  leaveRoom(user, room.id);
                }}
              >
                disconnect
              </RedButton>
            </div>
          </div>
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
        </div>
      </div>
    );
  }

  return <LoadingLayout />;
};

export default RoomPage;
