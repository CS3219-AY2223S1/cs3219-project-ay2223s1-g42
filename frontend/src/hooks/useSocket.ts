import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";

import { env } from "../env/client.mjs";
import { User } from "../login/types.js";

const socket = io(env.NEXT_PUBLIC_API_URL);

type Call = {
  from?: User;
  signal?: Peer.SignalData;
};

export default function useSocket() {
  const [callAccepted, setCallAccepted] = useState<boolean>(false);
  const [callEnded, setCallEnded] = useState<boolean>(false);
  const [stream, setStream] = useState<MediaStream | undefined>();
  const [name, setName] = useState<string>("");
  const [call, setCall] = useState<Call>({
    from: undefined,
    signal: undefined,
  });
  const [me, setMe] = useState<string>("");

  const myVideo = useRef<HTMLMediaElement>();
  const otherVideo = useRef<HTMLMediaElement>();
  const connectionRef = useRef<Peer.Instance>();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
        if (!myVideo.current) {
          return;
        }
        // set source of media for video element
        myVideo.current!.srcObject = stream;
      });
  }, []);

  const answerCall = () => {
    setCallAccepted(true);

    const peer = new Peer({ initiator: false, trickle: false, stream });
    peer.on("signal", (data) => {
      socket.emit("answerCall", { signal: data, to: call.from });
    });
    peer.on("stream", (currentStream) => {
      if (!otherVideo.current) {
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
      socket.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: me,
        name,
      });
    });
    peer.on("stream", (currentStream) => {
      if (!otherVideo.current) {
        return;
      }
      otherVideo.current.srcObject = currentStream;
    });
    socket.on("callAccepted", (signal) => {
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

  return {
    call,
    callAccepted,
    myVideo,
    otherVideo,
    stream,
    name,
    setName,
    callEnded,
    me,
    callUser,
    leaveCall,
    answerCall,
  };
}
