import { useCallback, useEffect, useRef } from "react";
import shallow from "zustand/shallow";
import Editor from "@monaco-editor/react";
import * as monaco from "monaco-editor";

import { SpinnerIcon } from "src/components";
import { LANGUAGE, useGlobalStore } from "src/store";

const RoomEditor = () => {
  const setupEditorRef = useRef(useGlobalStore((state) => state.setupEditor));
  const cleanupEditorRef = useRef(
    useGlobalStore((state) => state.cleanupEditor)
  );
  const { input, language } = useGlobalStore((state) => {
    return {
      input: state.editorInput,
      language: state.editorLanguage,
    };
  }, shallow);
  // const [editorMounted, setEditorMounted] = useState<boolean>(false);

  const handleEditorDidMount = useCallback(
    (editor: monaco.editor.IStandaloneCodeEditor) => {
      const setupEditor = setupEditorRef.current;
      setupEditor(editor);
    },
    []
  );

  useEffect(() => {
    return () => {
      console.log("cleaning up editor");
      const cleanupEditor = cleanupEditorRef.current;
      cleanupEditor();
    };
  }, []);

  return (
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
      loading={<SpinnerIcon />}
    />
  );
};

export { RoomEditor };
