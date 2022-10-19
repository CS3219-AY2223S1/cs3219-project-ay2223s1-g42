import { StateCreator } from "zustand";
import Peer from "simple-peer";
import { UserInfo } from "shared/api";

import type { GlobalStore } from "./useGlobalStore";

export type Call = {
  from?: UserInfo;
  signal?: Peer.SignalData;
};

export type CallSlice = {
  // video data
  callAccepted: boolean;
  callEnded: boolean;
  stream: MediaStream | undefined;
  name: string;
  call: Call | undefined;
  connected: boolean;
  myVideo: React.MutableRefObject<HTMLMediaElement | undefined> | undefined;
  otherVideo: React.MutableRefObject<HTMLMediaElement | undefined> | undefined;
  connectionRef: React.MutableRefObject<Peer.Instance | undefined> | undefined;
  answerCall: () => void;
  callUser: (from: UserInfo, id: number) => void;
  leaveCall: () => void;
  setupVideo: () => void;
};

const createCallSlice: StateCreator<GlobalStore, [], [], CallSlice> = (
  setState,
  getState
) => {
  const setupVideo = async () => {
    const myVideoRef = getState().myVideo;
    if (!myVideoRef) {
      // break if my video ref not set
      console.error("fail to set up video, no video ref set!");
      return;
    }
    if (!myVideoRef.current) {
      // break if my video ref current not set
      console.error("fail to set up video, no video ref set!");
      return;
    }

    // store stream + set src object in my video ref
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    myVideoRef.current.srcObject = stream;
    setState({ stream });
  };

  const answerCall = () => {
    const stream = getState().stream;
    if (!stream) {
      console.error("failed to answer call, no stream set!");
      return;
    }

    // set up peer
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      const roomSocket = getState().roomSocket;
      if (!roomSocket) {
        console.error("failed to answer call, no room socket set!");
        return;
      }

      const call = getState().call;
      if (!call) {
        console.error("failed to answer call, no call set!");
        return;
      }
      const from = call.from;
      if (!from) {
        console.error("failed to answer call, no 'from user' set in call!");
        return;
      }
      roomSocket.emit("answerCall", {
        signal: data,
        to: from,
      });
    });

    peer.on("stream", (currentStream) => {
      const otherVideoRef = getState().otherVideo;
      if (!otherVideoRef) {
        // break if other video ref not set
        console.error("failed to stream call, no other video element ref set!");
        return;
      }
      if (!otherVideoRef.current) {
        // break if other video ref current not set
        console.error(
          "failed to stream call, no other video element ref current set!"
        );
        return;
      }
      otherVideoRef.current.srcObject = currentStream;
    });

    // send signal to peer
    const call = getState().call;
    if (!call) {
      console.error("failed to send signal to peer, no call set!");
      return;
    }
    const signal = call.signal;
    if (!signal) {
      // break if signal not set
      console.error("failed to send signal to peer, no signal set!");
      return;
    }
    peer.signal(signal);

    // store peer in connection ref
    const connectionRef = getState().connectionRef;
    if (!connectionRef) {
      // break if connection ref not set
      console.error('failed to store peer data, no "connection ref" set!');
      return;
    }

    connectionRef.current = peer;
    setState({ callAccepted: true });
  };

  const callUser = (from: UserInfo, id: number) => {
    // set up peer
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: getState().stream,
    });

    peer.on("signal", (data) => {
      const roomSocket = getState().roomSocket;
      if (!roomSocket) {
        // break if socket not set
        console.error("failed to respond to signal event, no room socket set!");
        return;
      }
      roomSocket.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: from,
      });
    });

    peer.on("stream", (currentStream) => {
      const otherVideoRef = getState().otherVideo;
      if (!otherVideoRef) {
        // break if other video ref not set
        console.error("failed to stream, no other video element ref set!");
        return;
      }

      if (!otherVideoRef.current) {
        // break if other video ref current not set
        console.error(
          "failed to set other video source, no other video element ref set!"
        );
        return;
      }

      otherVideoRef.current.srcObject = currentStream;
    });

    // set up call accepted event
    const roomSocket = getState().roomSocket;
    if (!roomSocket) {
      // break if socket not set
      console.error("failed to stream, no room socket set!");
      return;
    }

    roomSocket.on("callAccepted", (signal) => {
      peer.signal(signal);
      setState({ callAccepted: true });
    });

    // store peer in connection ref
    const connectionRef = getState().connectionRef;
    if (!connectionRef) {
      // break if connection ref not set
      return;
    }
    connectionRef.current = peer;
  };

  const leaveCall = () => {
    const connectionRef = getState().connectionRef;
    if (!connectionRef) {
      // break if connection ref not set
      console.error("failed to leave call, connection ref not set!");
      return;
    }
    if (!connectionRef.current) {
      console.error("failed to leave call, connection ref current not set!");
    }
    connectionRef.current?.destroy();
    setState({ callEnded: true });
  };

  return {
    callAccepted: false,
    callEnded: false,
    stream: undefined,
    name: "",
    call: undefined,
    connected: false,
    myVideo: undefined,
    otherVideo: undefined,
    connectionRef: undefined,
    answerCall,
    callUser,
    leaveCall,
    setupVideo,
  };
};

export { createCallSlice };
