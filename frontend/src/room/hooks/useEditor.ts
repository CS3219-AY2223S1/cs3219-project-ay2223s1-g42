import { useState, useEffect } from "react";
import { MonacoBinding } from "y-monaco";
import { SocketIOProvider } from "y-socket.io";
import * as Y from "yjs";
import * as monaco from "monaco-editor";

import { useAuthStore } from "src/hooks";

const useEditor = () => {
  const [doc, setDoc] = useState<Y.Doc | null>(null);
  const [text, setText] = useState<Y.Text | null>(null);
  const [provider, setProvider] = useState<SocketIOProvider | null>(null);
  const [connected, setConnected] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");
  const [clients, setClients] = useState<string[]>([]);
  const [binding, setBinding] = useState<MonacoBinding>();
  const [editor, setEditor] = useState<monaco.editor.IStandaloneCodeEditor>();
  const user = useAuthStore((state) => state.user);

  function handleEditorDidMount(editor: monaco.editor.IStandaloneCodeEditor) {
    // here is the editor instance
    // you can store it in `useRef` for further usage
    // we store in `useState` since we want to re-run
    // the effect when the editor instance changes
    setEditor(editor);
  }

  // set up document
  useEffect(() => {
    if (!!doc) {
      // break if doc is already initialized
      return;
    }
    const _doc = new Y.Doc();
    const yMap = _doc.getMap("data");
    if (!yMap.has("input")) {
      yMap.set("input", "");
      yMap.observe((event, transaction) => {
        console.log({ event, transaction });
        setInput(yMap.get("input") as string);
      });
    }
    setDoc(_doc);
  }, [doc]);

  // set up provider
  useEffect(() => {
    if (provider) {
      // break if provider is already initialized
      return;
    }

    if (!doc) {
      // break if doc not set
      return;
    }

    const socketIOProvider = new SocketIOProvider(
      import.meta.env.VITE_WS_URL,
      "testing-doc",
      doc,
      {
        autoConnect: true,
        // disableBc: true,
        // auth: { token: 'valid-token' },
      }
    );
    const docText = doc.getText("monaco");
    socketIOProvider.awareness.on("change", () =>
      setClients(
        Array.from(socketIOProvider.awareness.getStates().keys()).map(
          (key) => `${key}`
        )
      )
    );
    socketIOProvider.awareness.setLocalState({
      id: user?.id,
      name: user?.username,
    });
    socketIOProvider.on("sync", (status: boolean) =>
      console.log("websocket sync", status)
    );
    socketIOProvider.on("status", ({ status }: { status: string }) => {
      if (status === "connected") {
        setConnected(true);
      } else {
        setConnected(false);
      }
    });
    setText(docText);
    setProvider(socketIOProvider);
  }, [doc, provider, user?.id, user?.username]);

  // set up monaco binding
  useEffect(() => {
    if (!editor) {
      console.error("editor not set, breaking...");
      return;
    }
    const model = editor.getModel();
    if (!model || !text || !provider) {
      console.error("model/text/provider not set, breaking...");
      return;
    }
    const monacoBinding = new MonacoBinding(
      text,
      /** @type {monaco.editor.ITextModel} */ model,
      new Set([editor]),
      provider.awareness
    );
    setBinding(monacoBinding);
  }, [editor, text, provider]);

  return {
    doc,
    text,
    provider,
    connected,
    input,
    clients,
    binding,
    handleEditorDidMount,
  };
};

export { useEditor };
