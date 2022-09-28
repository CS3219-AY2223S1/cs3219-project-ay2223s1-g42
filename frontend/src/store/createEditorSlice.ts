import { StateCreator } from "zustand";
import { createRef } from "react";
import { MonacoBinding } from "y-monaco";
import { SocketIOProvider } from "y-socket.io";
import * as Y from "yjs";
import * as monaco from "monaco-editor";

import type { GlobalStore } from "./useGlobalStore";
import { User } from "src/login";
import { LANGUAGE } from "./enums";

export type EditorSlice = {
  doc: Y.Doc | undefined;
  text: Y.Text | undefined;
  editorLanguage: LANGUAGE;
  editorProvider: SocketIOProvider | undefined;
  isEditorProviderConnected: boolean;
  editorInput: string | undefined;
  editorClients: string[] | undefined;
  editorBinding: MonacoBinding | undefined;
  setEditorLanguage: (language: LANGUAGE) => void;
  setupEditor: (
    editor: monaco.editor.IStandaloneCodeEditor,
    user: User,
    roomId: string
  ) => void;
  cleanupEditor: () => void;
};

const createEditorSlice: StateCreator<GlobalStore, [], [], EditorSlice> = (
  setState,
  getState
) => {
  const setEditorLanguage = (language: LANGUAGE) => {
    const binding = getState().editorBinding;
    if (binding) {
      binding.ytext.setAttribute("language", language);
    }
    setState({ editorLanguage: language });
  };

  const setupDoc = () => {
    const _doc = getState().doc;
    const doc = !!_doc ? _doc : new Y.Doc();
    return doc;
  };

  const setupEditor = (
    editor: monaco.editor.IStandaloneCodeEditor,
    user: User,
    roomId: string
  ) => {
    // set up doc
    const doc = setupDoc();

    // set up provider
    const socketIOProvider = new SocketIOProvider(
      import.meta.env.VITE_WS_URL,
      roomId,
      doc,
      {
        autoConnect: true,
        resyncInterval: 100,
        // disableBc: true,
        // auth: { token: 'valid-token' },
      }
    );

    // set up monaco editor doc text
    const docText = doc.getText("monaco");

    // set up socket io provider awareness
    socketIOProvider.awareness.on("change", () => {
      const clients = socketIOProvider.awareness.getStates();
      const clientIds = Array.from(clients).map((key) => `${key}`);
      setState({ editorClients: clientIds });
    });
    socketIOProvider.awareness.setLocalState({
      id: user?.id,
      name: user?.username,
    });

    // set up socket io provider events
    socketIOProvider.on("sync", (status: boolean) =>
      console.log("websocket sync", status)
    );
    socketIOProvider.on("status", ({ status }: { status: string }) => {
      const connected = status === "connected";
      setState({ isEditorProviderConnected: connected });
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

    // observe document language + editor document text changes
    monacoBinding?.ytext.observe((event, transaction) => {
      const updatedInput = transaction.doc.getText("monaco").toJSON();
      const language = event.target.getAttribute("language");
      setState({ editorLanguage: language, editorInput: updatedInput });
    });

    // set default language to typescript
    monacoBinding.ytext.setAttribute("language", LANGUAGE.TS);

    setState({
      doc,
      editorProvider: socketIOProvider,
      text: docText,
      editorBinding: monacoBinding,
    });
  };

  // clean up editor
  const cleanupEditor = () => {
    const doc = getState().doc;
    if (doc) {
      doc.destroy();
    }
    const provider = getState().editorProvider;
    if (provider) {
      provider.disconnect();
      provider.destroy();
    }
    const binding = getState().editorBinding;
    if (binding) {
      binding.destroy();
    }
    setState({
      doc: undefined,
      editorProvider: undefined,
      editorBinding: undefined,
    });
  };

  return {
    doc: undefined,
    text: undefined,
    editorLanguage: LANGUAGE.TS,
    editorProvider: undefined,
    isEditorProviderConnected: false,
    editorInput: undefined,
    editorClients: undefined,
    editorBinding: undefined,
    setupEditor,
    setEditorLanguage,
    cleanupEditor,
  };
};

export { createEditorSlice };
