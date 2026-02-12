import { Video, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../socket";

function Dashboard() {
  const navigate = useNavigate();
  const [searching, setSearching] = useState(false);

  const handleConnect = () => {
    setSearching(true);
    socket.emit("find-match");
  };

  useEffect(() => {

     socket.on("connect", () => {
       console.log("✅ Socket connected:", socket.id);
     });

    socket.on("match-found", (data) => {
      console.log("Matched:", data);

      navigate("/call", {
        state: {
          sessionId: data.sessionId,
          partnerId: data.partnerId,
        },
      });
    });

    socket.on("waiting", () => {
      console.log("Waiting for partner");
    });

    return () => {
      socket.off("connect");
      socket.off("match-found");
      socket.off("waiting");
    };
  }, []);

  return (
    <div className="p-6">
      {/* Greeting */}
      <h1 className="text-3xl font-bold text-gray-800 mb-1">
        Good Morning, username!
      </h1>
      <p className="text-gray-500 mb-8">
        Ready to continue your English journey?
      </p>

      {/* Practice Card */}
      <div className="bg-white rounded-3xl shadow-sm border p-12 text-center">
        {/* Icon Circle */}
        <div className="w-20 h-20 mx-auto flex items-center justify-center rounded-full bg-indigo-100 mb-6">
          <Video className="text-indigo-600" size={36} />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          Practice Speaking Today
        </h2>

        {/* Subtitle */}
        <p className="text-gray-500 max-w-xl mx-auto mb-8">
          Improve your fluency and confidence by connecting instantly with a
          native speaker.
        </p>

        {/* Button */}
        <button
          onClick={handleConnect}
          disabled={searching}
          className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:opacity-90 transition"
        >
          <Phone size={18} />
          {searching ? "Finding Partner..." : "Connect with English Partner"}
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
