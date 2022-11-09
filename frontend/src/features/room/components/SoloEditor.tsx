import shallow from "zustand/shallow";
import Editor from "@monaco-editor/react";
import * as monaco from "monaco-editor";

import { SpinnerIcon } from "src/components";
import { LANGUAGE, useGlobalStore } from "src/store";

const SoloEditor = () => {
  const { input, setInput, language } = useGlobalStore((state) => {
    return {
      input: state.editorInput,
      setInput: state.setEditorInput,
      language: state.editorLanguage,
    };
  }, shallow);

  const handleEditorChange = (
    value: string | undefined,
    ev: monaco.editor.IModelContentChangedEvent
  ) => {
    console.log({ value, ev });
    if (!value) {
      return;
    }
    setInput(value);
  };

  return (
    <Editor
      key={"solo-room"}
      defaultLanguage={LANGUAGE.TS}
      language={language}
      value={input}
      theme="vs-dark"
      className="h-full w-full"
      options={{
        "semanticHighlighting.enabled": true,
        autoIndent: "full",
        tabCompletion: "on",
      }}
      onChange={handleEditorChange}
      loading={<SpinnerIcon />}
    />
  );
};

export { SoloEditor };
