import { useCallback, useEffect, useRef, useState } from "react";
import shallow from "zustand/shallow";
import Editor, { useMonaco } from "@monaco-editor/react";
import * as monaco from "monaco-editor";

import { SpinnerIcon } from "src/components";
import { LANGUAGE, useGlobalStore } from "src/store";

const RoomEditor = () => {
  console.log("rendering room editor component!");
  const user = useGlobalStore((state) => state.user);
  const room = useGlobalStore((state) => state.room);
  const input = useGlobalStore((state) => state.editorInput);
  const language = useGlobalStore((state) => state.editorLanguage);
  const doc = useGlobalStore((state) => state.doc);
  const provider = useGlobalStore((state) => state.editorProvider);
  const setupDoc = useGlobalStore((state) => state.setupDoc);
  const setupProvider = useGlobalStore((state) => state.setupProvider);
  const setupBinding = useGlobalStore((state) => state.setupBinding);
  const monaco = useMonaco();
  const [editorMounted, setEditorMounted] = useState<boolean>(false);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor>();

  const handleEditorDidMount = useCallback(
    (editor: monaco.editor.IStandaloneCodeEditor) => {
      editorRef.current = editor;
      setEditorMounted(true);
    },
    []
  );

  // set up editor document on first mount
  useEffect(() => {
    console.log("setting up editor doc");
    setupDoc();
  }, [setupDoc]);

  // set up provider on editor first mount or when user or room changes
  useEffect(() => {
    if (!monaco) {
      console.error("failed to set up provider, monaco instance not set up");
      return;
    }
    setupProvider();
  }, [monaco, doc, user, room, setupProvider]);

  // set up binding whenever provider or monaco instance changes
  useEffect(() => {
    if (!editorRef.current || !monaco) {
      console.error(
        "failed to setup binding, editor ref or monaco instance not setup: ",
        { editorRef: editorRef.current, monaco }
      );
      return;
    }
    console.log("setting up binding");
    setupBinding(editorRef.current);
  }, [provider, monaco, editorMounted, setupBinding]);

  return (
    <Editor
      key={room?.id}
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
