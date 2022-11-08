import { createRef } from "react";
import { StateCreator } from "zustand";
import Peer from "simple-peer";

import { RoomUser, ROOM_EVENTS } from "shared/api";
import type { GlobalStore } from "./useGlobalStore";

export type Call = {
  from?: RoomUser;
  signal?: Peer.SignalData;
  isCaller?: boolean;
};

export type CallSlice = {
  // video data
  callAccepted: boolean;
  callEnded: boolean;
  stream: MediaStream | undefined;
  call: Call | undefined;
  isCaller: boolean;
  connected: boolean;
  myVideo: React.MutableRefObject<HTMLVideoElement | null>;
  myVideoConnected: boolean;
  otherVideo: React.MutableRefObject<HTMLVideoElement | null>;
  otherVideoConnected: boolean;
  connectionRef: React.MutableRefObject<Peer.Instance | null>;
  answerCall: () => void;
  callUser: (id: string) => void;
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

    // store stream + set src object in my video ref
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    myVideoRef.current!.srcObject = stream;
    setState({ stream, myVideoConnected: true });
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
      stream,
    });

    console.log("answering call with peer: ", { peer });

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
      const payload = JSON.stringify({
        signal: data,
        to: from,
      });
      roomSocket.emit(ROOM_EVENTS.ANSWER_CALL, payload);
    });

    peer.on("stream", (currentStream) => {
      const otherVideoRef = getState().otherVideo;
      // break if other video ref not set
      if (!otherVideoRef) {
        console.error("failed to stream call, no other video element ref set!");
        return;
      }
      otherVideoRef.current!.srcObject = currentStream;
      setState({ otherVideoConnected: true });
    });

    // send signal to peer
    const call = getState().call;
    if (!call) {
      console.error("failed to send signal to peer, no call set!");
      return;
    }
    const signal = call.signal;
    // break if signal not set
    if (!signal) {
      console.error("failed to send signal to peer, no signal set!");
      return;
    }
    peer.signal(signal);

    // store peer in connection ref
    const connectionRef = getState().connectionRef;
    // break if connection ref not set
    if (!connectionRef) {
      console.error('failed to store peer data, no "connection ref" set!');
      return;
    }

    connectionRef.current = peer;
    setState({ callAccepted: true });
  };

  const callUser = (socketId: string) => {
    const user = getState().user;
    const stream = getState().stream;
    const room = getState().room;
    if (!user || !stream || !room) {
      console.error(
        "failed to call user, no user or no stream or no room set!"
      );
      return;
    }
    const from = room.users.find((u) => u.id === user.id);
    if (!from) {
      console.error("failed to find logged in user's room user data");
      return;
    }
    // set up peer
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on("signal", (data) => {
      const roomSocket = getState().roomSocket;
      // break if socket not set
      if (!roomSocket) {
        console.error("failed to respond to signal event, no room socket set!");
        return;
      }
      const payload = JSON.stringify({
        userToCall: socketId,
        signalData: data,
        from,
      });
      roomSocket.emit(ROOM_EVENTS.CALL_USER, payload);
    });

    peer.on("stream", (currentStream) => {
      const otherVideoRef = getState().otherVideo;

      // break if other video ref not set
      if (!otherVideoRef) {
        console.error("failed to stream, no other video element ref set!");
        return;
      }
      // break if other video ref current not set
      if (!otherVideoRef.current) {
        console.error(
          "failed to set other video source, no other video element ref set!"
        );
        return;
      }

      otherVideoRef.current.srcObject = currentStream;
      setState({ otherVideoConnected: true });
    });

    // set up call accepted event
    const roomSocket = getState().roomSocket;
    // break if socket not set
    if (!roomSocket) {
      console.error("failed to stream, no room socket set!");
      return;
    }

    roomSocket.on(ROOM_EVENTS.CALL_ACCEPTED, (data) => {
      const { signal }: { signal: Peer.SignalData } = JSON.parse(data);
      peer.signal(signal);
      setState({ callAccepted: true });
    });

    // store peer in connection ref
    const connectionRef = getState().connectionRef;
    // break if connection ref not set
    if (!connectionRef) {
      return;
    }
    connectionRef.current = peer;
  };

  const leaveCall = () => {
    const connectionRef = getState().connectionRef;
    // break if connection ref not set
    if (!connectionRef) {
      console.error("failed to leave call, connection ref not set!");
      return;
    }
    if (!connectionRef.current) {
      console.error("failed to leave call, connection ref current not set!");
    }
    connectionRef.current?.destroy();
    setState({
      callEnded: true,
      myVideo: undefined,
      myVideoConnected: false,
      otherVideo: undefined,
      otherVideoConnected: false,
    });
  };

  return {
    callAccepted: false,
    callEnded: false,
    stream: undefined,
    call: undefined,
    isCaller: false,
    connected: false,
    myVideo: createRef(),
    myVideoConnected: false,
    otherVideo: createRef(),
    otherVideoConnected: false,
    connectionRef: createRef(),
    answerCall,
    callUser,
    leaveCall,
    setupVideo,
  };
};

export { createCallSlice };
