import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../socket";
import { useAuth } from "../auth/AuthContext";
import { Video, VideoOff, Mic, MicOff, PhoneOff } from "lucide-react";

const VideoCall = ({ sessionId, partnerId }) => {
  const localRef = useRef();
  const remoteRef = useRef();
  const pcRef = useRef();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [localStream, setLocalStream] = useState(null);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [callStatus, setCallStatus] = useState("Connecting...");

  useEffect(() => {
    init();

    socket.on("call-offer", onOffer);
    socket.on("call-answer", onAnswer);
    socket.on("ice-candidate", onIce);
    socket.on("end-call", handlePartnerDisconnect);

    return () => {
      socket.off("call-offer");
      socket.off("call-answer");
      socket.off("ice-candidate");
      socket.off("end-call");
      cleanup();
    };
  }, []);

  const init = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      setLocalStream(stream);
      localRef.current.srcObject = stream;

      const pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      pc.ontrack = (e) => {
        remoteRef.current.srcObject = e.streams[0];
        setCallStatus("Connected");
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

      pc.onconnectionstatechange = () => {
        if (pc.connectionState === "connected") {
          setCallStatus("Connected");
        } else if (pc.connectionState === "disconnected") {
          setCallStatus("Disconnected");
        }
      };

      pcRef.current = pc;

      // Auto-initiate call: user with smaller ID starts the call
      if (user?._id < partnerId) {
        setTimeout(() => startCall(), 1000);
      }
    } catch (error) {
      console.error("Permission denied:", error);
      alert(
        "Camera/Microphone access denied. Please enable permissions and try again."
      );
      navigate("/dashboard");
    }
  };

  const startCall = async () => {
    try {
      const offer = await pcRef.current.createOffer();
      await pcRef.current.setLocalDescription(offer);

      socket.emit("call-offer", {
        sessionId,
        offer,
        to: partnerId,
      });
    } catch (error) {
      console.error("Error starting call:", error);
    }
  };

  const onOffer = async ({ offer, from }) => {
    try {
      await pcRef.current.setRemoteDescription(offer);

      const answer = await pcRef.current.createAnswer();
      await pcRef.current.setLocalDescription(answer);

      socket.emit("call-answer", {
        sessionId,
        answer,
        to: from,
      });
    } catch (error) {
      console.error("Error handling offer:", error);
    }
  };

  const onAnswer = async ({ answer }) => {
    try {
      await pcRef.current.setRemoteDescription(answer);
    } catch (error) {
      console.error("Error handling answer:", error);
    }
  };

  const onIce = async ({ candidate }) => {
    try {
      await pcRef.current.addIceCandidate(candidate);
    } catch (error) {
      console.error("Error adding ICE candidate:", error);
    }
  };

  const toggleCamera = () => {
    const videoTrack = localStream?.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setIsCameraOn(videoTrack.enabled);
    }
  };

  const toggleMic = () => {
    const audioTrack = localStream?.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setIsMicOn(audioTrack.enabled);
    }
  };

  const endCall = () => {
    socket.emit("call-end", { sessionId, to: partnerId });
    cleanup();
    navigate("/dashboard");
  };

  const handlePartnerDisconnect = () => {
    alert("Your partner has left the call.");
    cleanup();
    navigate("/dashboard");
  };

  const cleanup = () => {
    localStream?.getTracks().forEach((track) => track.stop());
    pcRef.current?.close();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border p-4 mb-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Video Call</h2>
          <span className="text-sm text-gray-500">{callStatus}</span>
        </div>

        {/* Video Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Remote Video (Partner) */}
          <div className="bg-black rounded-2xl overflow-hidden aspect-video relative">
            <video
              ref={remoteRef}
              autoPlay
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-lg text-sm">
              Partner
            </div>
          </div>

          {/* Local Video (You) */}
          <div className="bg-black rounded-2xl overflow-hidden aspect-video relative">
            <video
              ref={localRef}
              autoPlay
              muted
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-lg text-sm">
              You
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <div className="flex justify-center gap-4">
            {/* Camera Toggle */}
            <button
              onClick={toggleCamera}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition ${isCameraOn
                  ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  : "bg-red-500 text-white hover:bg-red-600"
                }`}
            >
              {isCameraOn ? (
                <>
                  <Video size={20} />
                  Camera On
                </>
              ) : (
                <>
                  <VideoOff size={20} />
                  Camera Off
                </>
              )}
            </button>

            {/* Mic Toggle */}
            <button
              onClick={toggleMic}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition ${isMicOn
                  ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  : "bg-red-500 text-white hover:bg-red-600"
                }`}
            >
              {isMicOn ? (
                <>
                  <Mic size={20} />
                  Unmuted
                </>
              ) : (
                <>
                  <MicOff size={20} />
                  Muted
                </>
              )}
            </button>

            {/* End Call */}
            <button
              onClick={endCall}
              className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-700 transition"
            >
              <PhoneOff size={20} />
              End Call
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCall;
