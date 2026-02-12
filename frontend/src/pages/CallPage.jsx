import { useLocation } from "react-router-dom";
import VideoCall from "../components/VideoCall.jsx";

const CallPage = () => {
  const { state } = useLocation();

  if (!state) return <h2>No session</h2>;

  return <VideoCall sessionId={state.sessionId} partnerId={state.partnerId} />;
};

export default CallPage;
