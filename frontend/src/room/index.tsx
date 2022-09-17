import * as Y from "yjs";
import { CodemirrorBinding } from "y-codemirror";
import { WebrtcProvider } from "y-webrtc";
import CodeMirror from "codemirror";
import { useEffect, useRef, useState } from "react";
import "codemirror/mode/javascript/javascript.js";
import "codemirror/mode/python/python";
import "codemirror/addon/mode/multiplex";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material-darker.css";
import { useRouter } from "next/router";

const Editor = () => {
  const router = useRouter();
  const [name, setName] = useState("Name");
  const [color, setColor] = useState("#008833");
  const editor = useRef(null);
  const id = router.query.id;

  const connect = (room: string) => {
    try {
      const ydoc = new Y.Doc();
      const provider = new WebrtcProvider(room, ydoc);
      const yText = ydoc.getText("codemirror");
      const yUndoManager = new Y.UndoManager(yText);

      const e = CodeMirror(document.getElementById("editor")!, {
        mode: { name: "javascript", typescript: true },
        lineNumbers: true,
        theme: "material-darker",
        autocorrect: true,
        spellcheck: true,
      });

      (window as any).binding = new CodemirrorBinding(
        yText,
        e,
        provider.awareness,
        {
          yUndoManager,
        }
      );
      console.log("connect to", room);
      (window as any).binding.awareness.setLocalStateField("user", {
        color: color,
        name: name,
      });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (id) {
      const userId = Math.random() > 0.5 * 10;
      connect(id as string);
      (window as any).binding.awareness.setLocalStateField("user", {
        color: "#008833",
        name: `nigger${userId}`,
      });
    }
  }, [id]);

  return (
    <div className="100vh bg-red-500">
      {/* {id ? (
        <>
          <p style={{ display: "inline" }}>
            You have connected to a shared editor. You can share this link to
            more collaboraters:
          </p>
          <input
            readOnly
            type="text"
            value={`https://0t7bn.csb.app/${id}`}
            size="50"
            id="myInput"
          />
          <button onClick={copy}>copy</button> <br />
          <br />
          <p style={{ display: "inline" }}>You can rename yourself here: </p>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              window.binding.awareness.setLocalStateField("user", {
                color: "#008833",
                name: e.target.value,
              });
            }}
            size="15"
            id="name"
          />
          <button
            style={{ backgroundColor: color }}
            onClick={() => {
              let c = randomHex();
              setColor(c);
              window.binding.awareness.setLocalStateField("user", {
                color: c,
                name: name,
              });
            }}
          >
            Change a color
          </button>
        </>
      ) : (
        <div className="m-10">
          <ol>
            <li>Click new</li>
            <li>Copy the generated URL</li>
            <li>Share it or open another window to test collaboration!</li>
          </ol>
          <button
            className="hover:bg-indigo-200 bg-indigo-300 text-yellow-800 shadow rounded py-1 px-5"
            onClick={newRoom}
          >
            new
          </button>
        </div>
      )} */}
      <div id="editor" className="h-[100vh]"></div>
    </div>
  );
};

export default Editor;
