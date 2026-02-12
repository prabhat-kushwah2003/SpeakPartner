import { useEffect, useRef } from "react";
import socket from "../socket";

const VideoCall = ({ sessionId, partnerId }) => {
  const localRef = useRef();
  const remoteRef = useRef();
  const pcRef = useRef();

  useEffect(() => {
    init();

    socket.on("call-offer", onOffer);
    socket.on("call-answer", onAnswer);
    socket.on("ice-candidate", onIce);

    return () => {
      socket.off("call-offer");
      socket.off("call-answer");
      socket.off("ice-candidate");
    };
  }, []);

  const init = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    localRef.current.srcObject = stream;

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    stream.getTracks().forEach((track) => pc.addTrack(track, stream));

    pc.ontrack = (e) => {
      remoteRef.current.srcObject = e.streams[0];
    };

    pc.onicecandidate = (e) => {
      if (e.candidate) {
        socket.emit("ice-candidate", {
          sessionId,
          candidate: e.candidate,
          to: partnerId,
        });
      }
    };
    pcRef.current = pc;
  };

  const startCall = async () => {
    const offer = await pcRef.current.createOffer();
    await pcRef.current.setLocalDescription(offer);

    socket.emit("call-offer", {
      sessionId,
      offer,
      to: partnerId,
    });
  };

  const onOffer = async ({ offer, from }) => {
    await pcRef.current.setRemoteDescription(offer);

    const answer = await pcRef.current.createAnswer();
    await pcRef.current.setLocalDescription(answer);

    socket.emit("call-answer", {
      sessionId,
      answer,
      to: from,
    });
  };

  const onAnswer = async ({ answer }) => {
    await pcRef.current.setRemoteDescription(answer);
  };

  const onIce = async ({ candidate }) => {
    await pcRef.current.addIceCandidate(candidate);
  };

  return (
    <div>
      <h2>Video Call</h2>

      <video ref={localRef} autoPlay muted width="200" />
      <video ref={remoteRef} autoPlay width="200" />

      <button onClick={startCall}>Start Call</button>
    </div>
  );
};

export default VideoCall;
