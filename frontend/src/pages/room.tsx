import Editor from "@monaco-editor/react";

import { BaseDropdown, BaseListbox, LoadingLayout } from "src/components";
import { RoomTabs, useEditor } from "src/room";

const RoomPage = (): JSX.Element => {
  const {
    doc,
    text,
    binding,
    clients,
    connected,
    input,
    provider,
    handleEditorDidMount,
  } = useEditor();

  if (!provider) {
    return <LoadingLayout />;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-3 w-full h-full p-3">
      <div className="w-full h-full max-h-full border-[1px] border-neutral-800">
        <RoomTabs />
        {/* App
        <p>State: {connected ? "Connected" : "Disconneted"}</p>
        {!connected && (
          <>
            <button
              onClick={() => {
                provider.connect();
                console.log("clicked connect");
              }}
            >
              Connect
            </button>
          </>
        )}
        <pre>{JSON.stringify(clients, null, 4)}</pre> */}
      </div>

      <div className="flex flex-col w-full h-full border-neutral-900 border-[1px] bg-blue-500">
        <BaseListbox />
        {!!doc ? (
          <>
            <Editor
              // height="auto"
              defaultLanguage="typescript"
              value={input}
              theme="vs-dark"
              className="w-full"
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
};

export default RoomPage;
