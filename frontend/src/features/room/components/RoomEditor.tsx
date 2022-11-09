import { useCallback, useEffect, useRef, useState } from "react";
import shallow from "zustand/shallow";
import Editor, { useMonaco } from "@monaco-editor/react";
import * as monaco from "monaco-editor";

import { SpinnerIcon } from "src/components";
import { useGlobalStore } from "src/store";

const RoomEditor = () => {
  const {
    room,
    input,
    language,
    doc,
    provider,
    binding,
    setupDoc,
    setupProvider,
    cleanupProvider,
    setupBinding,
    cleanupBinding,
  } = useGlobalStore((state) => {
    return {
      room: state.room,
      input: state.editorInput,
      language: state.editorLanguage,
      doc: state.doc,
      provider: state.editorProvider,
      binding: state.editorBinding,
      setupDoc: state.setupDoc,
      setupProvider: state.setupProvider,
      cleanupProvider: state.cleanupProvider,
      setupBinding: state.setupBinding,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // set up provider when room or document changes
  useEffect(() => {
    if (provider || !doc) {
      return;
    }
    setupProvider();
  }, [doc, provider, room, setupProvider]);

  useEffect(() => {
    if (!provider) {
      return;
    }
    return () => {
      cleanupProvider();
    };
  }, [provider, cleanupProvider]);

  // set up binding when provider or monaco instance or document changes
  useEffect(() => {
    if (!editorRef.current || !monaco || !editorMounted) {
      console.error(
        "failed to setup binding, editor ref or monaco instance not setup: ",
        { editorRef: editorRef.current, monaco }
      );
      return;
    }
    setupBinding(editorRef.current);
  }, [provider, monaco, doc, editorMounted, setupBinding]);

  useEffect(() => {
    if (!binding) {
      return;
    }
    return () => {
      cleanupBinding();
    };
  }, [binding, cleanupBinding]);

  return (
    <Editor
      key={room?.id}
      language={language}
      value={input}
      theme="vs-dark"
      className="z-0 h-full w-full"
      options={{
        "semanticHighlighting.enabled": true,
        autoIndent: "full",
        tabCompletion: "on",
      }}
      onMount={handleEditorDidMount}
      loading={<SpinnerIcon />}
    />
  );
};

export { RoomEditor };
