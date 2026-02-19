import { Video, Phone } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../socket";

function Dashboard() {
  const navigate = useNavigate();
  const [searching, setSearching] = useState(false);
  const [noPartnerMessage, setNoPartnerMessage] = useState(false);
  const searchTimeoutRef = useRef(null);

  const handleConnect = () => {
    setSearching(true);
    setNoPartnerMessage(false);
    socket.emit("find-match");

    // Set timeout for "no partner available" message
    searchTimeoutRef.current = setTimeout(() => {
      setNoPartnerMessage(true);
      setSearching(false);
    }, 15000); // 15 seconds timeout
  };

  const cancelSearch = () => {
    setSearching(false);
    setNoPartnerMessage(false);
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    // Note: Backend doesn't have cancel-search event, but removing from queue on disconnect
    // User can just click search again
  };

  useEffect(() => {
    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
    });

    socket.on("match-found", (data) => {
      console.log("Matched:", data);

      // Clear timeout since match was found
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      setSearching(false);
      setNoPartnerMessage(false);

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
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
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

        {/* No Partner Message */}
        {noPartnerMessage && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-xl mb-4 max-w-md mx-auto">
            <p className="font-medium">No partner available right now.</p>
            <p className="text-sm">Please try again in a moment.</p>
          </div>
        )}

        {/* Button */}
        {!searching ? (
          <button
            onClick={handleConnect}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:opacity-90 transition"
          >
            <Phone size={18} />
            Connect with English Partner
          </button>
        ) : (
          <div className="inline-flex flex-col items-center gap-3">
            <button
              disabled
              className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg opacity-75"
            >
              <Phone size={18} className="animate-pulse" />
              Finding Partner...
            </button>
            <button
              onClick={cancelSearch}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
