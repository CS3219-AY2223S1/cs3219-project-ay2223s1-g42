import type { NextPage } from "next";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import * as Y from "yjs";
// import { MonacoBinding } from "y-monaco";
import { SocketIOProvider } from "y-socket.io";
import Editor from "@monaco-editor/react";
import * as monaco from "monaco-editor";

const Home: NextPage = () => {
  const [doc, setDoc] = useState<Y.Doc | null>(null);
  const [text, setText] = useState<Y.Text | null>(null);
  const [provider, setProvider] = useState<SocketIOProvider | null>(null);
  const [connected, setConnected] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");
  const [clients, setClients] = useState<string[]>([]);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor>();
  // const bindingRef = useRef<MonacoBinding>();

  function handleEditorDidMount(
    editor: monaco.editor.IStandaloneCodeEditor,
    monaco: any
  ) {
    console.log("editor did mount: ", { editor });
    // here is the editor instance
    // you can store it in `useRef` for further usage
    editorRef.current = editor;
  }

  function handleEditorChange(value: any, event: any) {
    if (value !== input) {
      if (doc) {
        doc.getMap("data").set("input", value ?? "");
      }
    }
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
        if (status === "connected") setConnected(true);
        else setConnected(false);
      });

      if (editorRef.current) {
        const editor = editorRef.current;
        const model = editor.getModel();
        if (!model) {
          console.log("editor model is null");
          return;
        }
        // const monacoBinding = new MonacoBinding(
        //   docText,
        //   /** @type {monaco.editor.ITextModel} */ model,
        //   new Set([editor]),
        //   socketIOProvider.awareness
        // );
        // bindingRef.current = monacoBinding;
      }

      setProvider(socketIOProvider);
    }
  }, [doc, provider]);

  if (!provider) return <h1>Initializing provider...</h1>;

  return (
    <div>
      App
      <div style={{ color: "white" }}>
        <p>State: {connected ? "Connected" : "Disconneted"}</p>
        {!connected ? (
          <>
            <button onClick={() => provider.connect()}>Connect</button>
          </>
        ) : (
          !!doc && (
            <div style={{ display: "flex", flexDirection: "column" }}>
              <pre>{JSON.stringify(clients, null, 4)}</pre>
              <Editor
                height="20vh"
                defaultLanguage="typescript"
                value={input}
                // onChange={handleEditorChange}
                onMount={handleEditorDidMount}
              />
              <br />
              <button
                onClick={() =>
                  doc.getMap("data").set("input", `${Math.random()}`)
                }
              >
                Emit random change
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Home;
