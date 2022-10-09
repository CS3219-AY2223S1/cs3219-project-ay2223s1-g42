import { StateCreator } from "zustand";
import { MonacoBinding } from "y-monaco";
import { SocketIOProvider } from "y-socket.io";
import * as Y from "yjs";
import * as monaco from "monaco-editor";

import type { GlobalStore } from "./useGlobalStore";
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
  setupDoc: () => void;
  setupProvider: () => void;
  setupBinding: (editor: monaco.editor.IStandaloneCodeEditor) => void;
  cleanupProvider: () => void;
  cleanupBinding: () => void;
  resetProviderBinding: () => void;
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

  // set up editor document
  const setupDoc = () => {
    const doc = new Y.Doc();
    const docText = doc.getText("monaco");
    setState({ doc, text: docText });
  };

  const cleanupProvider = () => {
    const provider = getState().editorProvider;
    if (!provider) {
      return;
    }
    provider.destroy();
    setState({ editorProvider: undefined });
  };

  // set up provider
  const setupProvider = () => {
    // cleanupProvider();

    // load doc and text
    const doc = getState().doc;
    const docText = getState().text;
    const user = getState().user;
    const room = getState().room;
    if (!doc || !docText || !user || !room) {
      console.error(
        "failed to setup provider, doc/doc text/user/room not initialized"
      );
      return;
    }

    // set up provider
    const socketIOProvider = new SocketIOProvider(
      import.meta.env.VITE_WS_URL,
      room.id,
      doc,
      {
        autoConnect: true,
        resyncInterval: 100,
        // disableBc: true,
        // auth: { token: 'valid-token' },
      }
    );

    // set up socket io provider awareness
    socketIOProvider.awareness.on("change", () => {
      const clients = socketIOProvider.awareness.getStates();
      const clientIds = Array.from(clients).map((key) => `${key}`);
      setState({ editorClients: clientIds });
    });
    socketIOProvider.awareness.setLocalState({
      id: user.id,
      name: user.username,
      color: "#ff9900",
    });

    // set up socket io provider events
    socketIOProvider.on("sync", (status: boolean) =>
      console.log("websocket sync", status)
    );
    socketIOProvider.on("status", ({ status }: { status: string }) => {
      const connected = status === "connected";
      console.log("socket io provider status: ", { status });
      setState({ isEditorProviderConnected: connected });
    });

    setState({ editorProvider: socketIOProvider });
  };

  const cleanupBinding = () => {
    const binding = getState().editorBinding;
    if (!binding) {
      return;
    }
    binding.destroy();
    setState({ editorBinding: undefined });
  };

  // set up binding to between provider and editor document text
  const setupBinding = (editor: monaco.editor.IStandaloneCodeEditor) => {
    const docText = getState().text;
    const provider = getState().editorProvider;
    const room = getState().room;
    const model = editor.getModel();

    if (!docText || !provider || !room || !model) {
      console.error(
        "failed to setup binding, editor text/provider/room/editor model not initialized: ",
        { docText, provider, room, model }
      );
      return;
    }

    console.log("setting up binding with: ", {
      docText,
      model,
      editor,
      awareness: provider.awareness,
    });

    if (!provider.socket.connected) {
      console.log("connecting to provider...");
      provider.connect();
    }

    const monacoBinding = new MonacoBinding(
      docText,
      /** @type {monaco.editor.ITextModel} */ model,
      new Set([editor]),
      provider.awareness
    );

    // observe document language + editor document text changes
    monacoBinding?.ytext.observe((event, transaction) => {
      const updatedInput = transaction.doc.getText("monaco").toJSON();
      const language = event.target.getAttribute("language");
      setState({
        editorLanguage: language,
        editorInput: updatedInput,
      });
    });

    // set initial editor document language to typescript
    const language = monacoBinding.ytext.getAttribute("language");
    if (!language) {
      monacoBinding.ytext.setAttribute("language", LANGUAGE.TS);
    }

    setState({
      editorBinding: monacoBinding,
      editorLanguage: language ?? LANGUAGE.TS,
    });
  };

  const resetProviderBinding = () => {
    setState({ editorProvider: undefined, editorBinding: undefined });
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
    setupDoc,
    setupProvider,
    setupBinding,
    setEditorLanguage,
    cleanupProvider,
    cleanupBinding,
    resetProviderBinding,
  };
};

export { createEditorSlice };
