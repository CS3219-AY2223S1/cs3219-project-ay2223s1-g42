import { useState, useRef, useEffect, ReactNode } from "react";
import * as Y from "yjs";
import { MonacoBinding } from "y-monaco";
import { SocketIOProvider } from "y-socket.io";
import Editor from "@monaco-editor/react";
import * as monaco from "monaco-editor";

import { BaseDropdown, BaseListbox } from "src/components";
import { RoomTabs } from "src/room";

const RoomPage = (): JSX.Element => {
  const [doc, setDoc] = useState<Y.Doc | null>(null);
  const [text, setText] = useState<Y.Text | null>(null);
  const [provider, setProvider] = useState<SocketIOProvider | null>(null);
  const [connected, setConnected] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");
  const [clients, setClients] = useState<string[]>([]);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor>();
  const bindingRef = useRef<MonacoBinding>();

  function handleEditorDidMount(
    editor: monaco.editor.IStandaloneCodeEditor,
    monaco: any
  ) {
    console.log("editor did mount: ", { editor });
    // here is the editor instance
    // you can store it in `useRef` for further usage
    editorRef.current = editor;
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
      const socketIOProvider = new SocketIOProvider(
        "ws://localhost:1234",
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
    console.log("editor ref: ", { editorRef });
    if (!!editorRef.current) {
      const editor = editorRef.current;
      const model = editor.getModel();
      console.log("model: ", { model });
      if (!model) {
        console.log("editor model is null");
        return;
      }
      if (!text) {
        return;
      }
      if (!provider) {
        return;
      }
      const monacoBinding = new MonacoBinding(
        text,
        /** @type {monaco.editor.ITextModel} */ model,
        new Set([editor]),
        provider.awareness
      );
      console.log("binding: ", { monacoBinding });
      bindingRef.current = monacoBinding;
    }
  }, [editorRef.current, text, provider]);

  if (!provider) {
    return <h1>Initializing provider...</h1>;
  }

  return (
    <div className="flex flex-col md:flex-row gap-3 w-full h-full px-3 py-2">
      <div className="w-full h-full border-[1px] border-neutral-800">
        <RoomTabs />
        {/* App
        <p>State: {connected ? "Connected" : "Disconneted"}</p>
        {!connected && (
          <>
            <button
              onClick={() => {
                provider.connect();
                console.log("clicked connect");
              }}
            >
              Connect
            </button>
          </>
        )}
        <pre>{JSON.stringify(clients, null, 4)}</pre> */}
      </div>

      <div className="flex flex-col w-full h-full border-neutral-900 border-[1px]">
        <BaseListbox />
        {!!doc ? (
          <>
            <Editor
              // height="auto"
              defaultLanguage="typescript"
              value={input}
              theme="vs-dark"
              className="w-full"
              // onChange={handleEditorChange}
              onMount={handleEditorDidMount}
            />
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default RoomPage;
