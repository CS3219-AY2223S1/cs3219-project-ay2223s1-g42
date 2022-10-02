import { useCallback, useEffect, useRef, useState } from "react";
import shallow from "zustand/shallow";
import Editor, { useMonaco } from "@monaco-editor/react";
import * as monaco from "monaco-editor";

import { SpinnerIcon } from "src/components";
import { LANGUAGE, useGlobalStore } from "src/store";

const RoomEditor = () => {
  const {
    user,
    room,
    input,
    language,
    doc,
    provider,
    setupDoc,
    setupProvider,
    setupBinding,
    cleanupProvider,
    cleanupBinding,
  } = useGlobalStore((state) => {
    return {
      user: state.user,
      room: state.room,
      input: state.editorInput,
      language: state.editorLanguage,
      doc: state.doc,
      provider: state.editorProvider,
      setupDoc: state.setupDoc,
      setupProvider: state.setupProvider,
      setupBinding: state.setupBinding,
      cleanupProvider: state.cleanupProvider,
      cleanupBinding: state.cleanupBinding,
    };
  }, shallow);
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
    setupDoc();
  }, [setupDoc]);

  // set up provider on editor first mount
  // or when user or room changes
  useEffect(() => {
    setupProvider();
    return () => cleanupProvider();
  }, [doc, monaco, user, room, setupProvider, cleanupProvider]);

  // set up binding whenever provider or
  // monaco instance changes
  useEffect(() => {
    if (!editorRef.current || !monaco) {
      console.error(
        "failed to setup binding, editor ref or monaco instance not setup"
      );
      return;
    }
    setupBinding(editorRef.current);
    return () => cleanupBinding();
  }, [provider, monaco, editorMounted, setupBinding, cleanupBinding]);

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
