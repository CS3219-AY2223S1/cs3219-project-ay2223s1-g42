import { useState, useEffect, useRef } from "react";
import { MonacoBinding } from "y-monaco";
import { SocketIOProvider } from "y-socket.io";
import * as Y from "yjs";
import * as monaco from "monaco-editor";

const useEditor = () => {
  const [doc, setDoc] = useState<Y.Doc | null>(null);
  const [text, setText] = useState<Y.Text | null>(null);
  const [provider, setProvider] = useState<SocketIOProvider | null>(null);
  const [connected, setConnected] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");
  const [clients, setClients] = useState<string[]>([]);
  const [binding, setBinding] = useState<MonacoBinding>();
  const [editor, setEditor] = useState<monaco.editor.IStandaloneCodeEditor>();

  function handleEditorDidMount(
    editor: monaco.editor.IStandaloneCodeEditor,
    monaco: any
  ) {
    // here is the editor instance
    // you can store it in `useRef` for further usage
    // we store in `useState` since we want to re-run
    // the effect when the editor instance changes
    setEditor(editor);
  }

  useEffect(() => {
    console.log("y text: ", { text });
  }, [text]);

  useEffect(() => {
    if (!doc) {
      console.log("setting doc");
      const _doc = new Y.Doc();
      const yMap = _doc.getMap("data");
      if (!yMap.has("input")) {
        yMap.set("input", "");
        yMap.observe((event, transaction) => {
          setInput(yMap.get("input") as string);
        });
      }
      setDoc(_doc);
    }
  }, [doc]);

  useEffect(() => {
    if (!!doc && !provider) {
      console.log("setting providers");
      // TODO: update to connect to nestjs backend
      const socketIOProvider = new SocketIOProvider(
        "ws://localhost:5000",
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
        id: Math.random(),
        name: "Perico",
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
    }
  }, [doc, provider]);

  useEffect(() => {
    console.log("running effect, ", { editor });
    if (editor) {
      const model = editor.getModel();
      console.log("model: ", { model });
      if (!model || !text || !provider) {
        console.log("editor model/text/provider is null");
        return;
      }
      const monacoBinding = new MonacoBinding(
        text,
        /** @type {monaco.editor.ITextModel} */ model,
        new Set([editor]),
        provider.awareness
      );
      console.log("binding: ", { monacoBinding });
      setBinding(monacoBinding);
    }
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
