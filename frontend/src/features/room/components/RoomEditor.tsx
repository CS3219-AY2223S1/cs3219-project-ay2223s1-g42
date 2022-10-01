import Editor from "@monaco-editor/react";
import * as monaco from "monaco-editor";

import { SpinnerIcon } from "src/components";
import { LANGUAGE, useGlobalStore } from "src/store";
import { UserInfo } from "shared/api";

type EditorProps = {
  user: UserInfo;
  roomId: string;
};

const RoomEditor = ({ user, roomId }: EditorProps) => {
  const { input, language, setup } = useGlobalStore((state) => {
    return {
      input: state.editorInput,
      language: state.editorLanguage,
      setup: state.setupEditor,
    };
  });

  const handleEditorDidMount = (
    editor: monaco.editor.IStandaloneCodeEditor
  ) => {
    setup(editor, user, roomId);
  };

  return (
    <Editor
      key={roomId}
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
      loading={<SpinnerIcon />}
    />
  );
};

export { RoomEditor };