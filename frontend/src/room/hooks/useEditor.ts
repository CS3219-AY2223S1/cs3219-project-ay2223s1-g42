import { createRef } from "react";
import { MonacoBinding } from "y-monaco";
import { SocketIOProvider } from "y-socket.io";
import * as Y from "yjs";
import * as monaco from "monaco-editor";
import create from "zustand";

import { User } from "src/login";

export enum LANGUAGE {
  TS = "typescript",
  JS = "javascript",
  PY = "python",
  CPP = "cpp",
}

type EditorStore = {
  doc: Y.Doc | undefined;
  text: Y.Text | undefined;
  language: LANGUAGE;
  provider: SocketIOProvider | undefined;
  connected: boolean;
  input: string | undefined;
  clients: string[] | undefined;
  binding: MonacoBinding | undefined;
  editor: monaco.editor.IStandaloneCodeEditor | undefined;
  setLanguage: (language: LANGUAGE) => void;
  setup: (
    editor: monaco.editor.IStandaloneCodeEditor,
    user: User,
    roomId: string
  ) => void;
  cleanup: () => void;
};

const EditorStoreValues = (
  setState: (values: Partial<EditorStore>) => void,
  getState: () => EditorStore
): EditorStore => {
  const setLanguage = (language: LANGUAGE) => {
    setState({ language });
  };

  const setup = (
    editor: monaco.editor.IStandaloneCodeEditor,
    user: User,
    roomId: string
  ) => {
    // set up doc
    const _doc = getState().doc;
    if (!!_doc) {
      // break if doc is already initialized
      console.error("doc is already initialized, aborting setup...");
      return;
    }
    const doc = new Y.Doc();
    const yMap = doc.getMap("data");
    if (!yMap.has("input")) {
      yMap.set("input", "");
      yMap.observe((event, transaction) => {
        console.log({ event, transaction });
        const updatedInput: string = yMap.get("input") as string;
        setState({ input: updatedInput });
      });
    }

    // set up provider
    const socketIOProvider = new SocketIOProvider(
      import.meta.env.VITE_WS_URL,
      roomId,
      doc,
      {
        autoConnect: true,
        // disableBc: true,
        // auth: { token: 'valid-token' },
      }
    );
    const docText = doc.getText("monaco");
    socketIOProvider.awareness.on("change", () => {
      const clients = Array.from(
        socketIOProvider.awareness.getStates().keys()
      ).map((key) => `${key}`);
      setState({ clients });
    });
    socketIOProvider.awareness.setLocalState({
      id: user?.id,
      name: user?.username,
    });
    socketIOProvider.on("sync", (status: boolean) =>
      console.log("websocket sync", status)
    );
    socketIOProvider.on("status", ({ status }: { status: string }) => {
      const connected = status === "connected";
      setState({ connected });
    });

    // set up binding
    const model = editor.getModel();
    if (!model) {
      console.error("editor model is undefined, fail to set up binding");
      return;
    }
    const monacoBinding = new MonacoBinding(
      docText,
      /** @type {monaco.editor.ITextModel} */ model,
      new Set([editor]),
      socketIOProvider.awareness
    );
    setState({
      doc,
      provider: socketIOProvider,
      text: docText,
      binding: monacoBinding,
    });
  };

  const cleanup = () => {
    const doc = getState().doc;
    if (!doc) {
      return;
    }
    const provider = getState().provider;
    if (!provider) {
      return;
    }
    const binding = getState().binding;
    if (!binding) {
      return;
    }
    doc.destroy();
    provider.disconnect();
    provider.destroy();
    binding.destroy();
    setState({ doc: undefined, provider: undefined, binding: undefined });
  };

  return {
    doc: undefined,
    text: undefined,
    language: LANGUAGE.TS,
    provider: undefined,
    connected: false,
    input: undefined,
    clients: undefined,
    binding: undefined,
    editor: undefined,
    setup,
    setLanguage,
    cleanup,
  };
};

export const useEditorStore = create<EditorStore>(EditorStoreValues);
