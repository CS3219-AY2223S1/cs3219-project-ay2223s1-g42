import Editor from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import { useEffect } from "react";

import { User } from "src/login";
import { LANGUAGE, useEditorStore } from "src/room";

type EditorProps = {
  user: User;
  roomId: string;
};

const RoomEditor = ({ user, roomId }: EditorProps) => {
  const { input, language, binding, setup, cleanup } = useEditorStore(
    (state) => {
      return {
        input: state.input,
        language: state.language,
        binding: state.binding,
        setup: state.setup,
        cleanup: state.cleanup,
      };
    }
  );

  const handleEditorDidMount = (
    editor: monaco.editor.IStandaloneCodeEditor
  ) => {
    console.log("setting up editor...");
    setup(editor, user, roomId);
  };

  useEffect(() => {
    return () => {
      if (binding) {
        console.log("cleaning up editor...");
        cleanup();
      }
    };
  }, []);

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
    />
  );
};

export { RoomEditor };
