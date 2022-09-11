import React, {
  createContext,
  useState,
  useRef,
  useEffect,
  useContext,
} from "react";
import { io, Socket } from "socket.io-client";
import Peer from "simple-peer";
import { User } from "../login/types";
import { useAuthStore } from "../login/hooks";

type ISocket = {
  callAccepted: boolean;
  callEnded: boolean;
  stream: MediaStream | undefined;
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  call: Call;
  myVideo: React.MutableRefObject<HTMLMediaElement | undefined> | undefined;
  otherVideo: React.MutableRefObject<HTMLMediaElement | undefined> | undefined;
  answerCall: () => void;
  callUser: (id: number) => void;
  leaveCall: () => void;
  sendChat: () => void;
};

const SocketContext = createContext<ISocket>({
  callAccepted: false,
  callEnded: false,
  stream: undefined,
  name: "",
  setName: () => {},
  call: { from: undefined, signal: undefined },
  myVideo: undefined,
  otherVideo: undefined,
  answerCall: () => {},
  callUser: (id: number) => {},
  leaveCall: () => {},
  sendChat: () => {},
});

type Call = {
  from?: User;
  signal?: Peer.SignalData;
};

// const socket = io("ws://localhost:5000", { withCredentials: true });

export const SocketProvider = ({ children }: { children: any }) => {
  const [socket, setSocket] = useState<Socket | undefined>(undefined);
  const [callAccepted, setCallAccepted] = useState<boolean>(false);
  const [callEnded, setCallEnded] = useState<boolean>(false);
  const [stream, setStream] = useState<MediaStream | undefined>();
  const [name, setName] = useState<string>("");
  const [call, setCall] = useState<Call>({
    from: undefined,
    signal: undefined,
  });
  const user = useAuthStore((state) => state.user);
  const [connected, setConnected] = useState<boolean>(false);

  const myVideo = useRef<HTMLMediaElement>();
  const otherVideo = useRef<HTMLMediaElement>();
  const connectionRef = useRef<Peer.Instance>();

  useEffect(() => {
    const socket = io("ws://localhost:5000", { withCredentials: true });
    socket.on("connect", () => {
      console.log("connected to websocket server");
      setConnected(true);
    });

    socket.on("disconnect", () => {
      setConnected(false);
    });

    socket.on("chat", (data) => {
      console.log({ data });
    });
    setSocket(socket);

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("chat");
    };
  }, [user]);

  // useEffect(() => {
  //   navigator.mediaDevices
  //     .getUserMedia({ video: true, audio: true })
  //     .then((stream) => {
  //       setStream(stream);
  //       if (!myVideo) {
  //         return;
  //       } else {
  //         // set source of media for video element
  //         myVideo.current!.srcObject = stream;
  //       }
  //     });
  // }, []);

  const answerCall = () => {
    setCallAccepted(true);

    const peer = new Peer({ initiator: false, trickle: false, stream });
    peer.on("signal", (data) => {
      socket?.emit("answerCall", { signal: data, to: call.from });
    });
    peer.on("stream", (currentStream) => {
      if (!otherVideo) {
        return;
      }
      otherVideo.current!.srcObject = currentStream;
    });
    peer.signal(call.signal!);
    connectionRef.current = peer;
  };

  const callUser = (id: number) => {
    const peer = new Peer({ initiator: true, trickle: false, stream });
    peer.on("signal", (data) => {
      socket?.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: user,
        name,
      });
    });
    peer.on("stream", (currentStream) => {
      if (!otherVideo) {
        return;
      }
      otherVideo.current!.srcObject = currentStream;
    });
    socket?.on("callAccepted", (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });
    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);
    connectionRef.current!.destroy();
    window.location.reload();
  };

  const sendChat = () => {
    socket?.emit("chat", { message: "hello to chat from client" });
  };

  return (
    <SocketContext.Provider
      value={{
        call,
        callAccepted,
        myVideo,
        otherVideo,
        stream,
        name,
        setName,
        callEnded,
        callUser,
        leaveCall,
        answerCall,
        sendChat,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

// Let's only export the `useAuth` hook instead of the context.
// We only want to use the hook directly and never the context comopnent.
export default function useSocket() {
  return useContext(SocketContext);
}
