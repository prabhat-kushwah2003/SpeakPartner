import { useEffect, useState } from "react";
import api from "../api/axios.js";

function History() {
  const [callHistory, setCallHistory] = useState([]);

  // fetch history from backend
  const fetchHistory = async () => {
    try {
      const res = await api.get("/calls");
      setCallHistory(res.data);
    } catch (error) {
      console.error("failed to fetch history", error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="p-6">
      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Call History</h1>
      {console.log(callHistory)}
      {/* Table */}
      <div className="bg-white border rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-[2fr_2fr_1fr_1fr_1fr] bg-gray-50 p-5 font-semibold text-gray-600">
          <p>User</p>
          <p>Date & Time</p>
          <p>Duration</p>
          <p>Recording</p>
          <p>Status</p>
        </div>

        {/* Rows */}
        {callHistory.map((call) => (
          <div
            key={call._id}
            className="grid grid-cols-[2fr_2fr_1fr_1fr_1fr] p-5 border-t items-center hover:bg-gray-50 transition"
          >
            {/* User + Avatar */}
            <div className="flex items-center gap-3">
              <img
                src={call.partnerId.avatar}
                alt="avatar"
                className="w-10 h-10 rounded-full object-cover"
              />
              <p className="font-medium text-gray-800">
                {call.partnerId.username}
              </p>
            </div>

            {/* Date */}
            <p className="text-gray-600">{call.datetime}</p>

            {/* Duration */}
            <p className="text-gray-600">{call.duration}</p>

            {/* Recording */}
            <a
              href={call.recording}
              className="text-indigo-600 font-medium hover:underline"
            >
              View Recording
            </a>

            {/* Status */}
            <div className="flex items-center gap-2">
              <span
                className={`w-3 h-3 rounded-full ${
                  call.online ? "bg-green-500" : "bg-gray-400"
                }`}
              ></span>

              <p
                className={`font-medium ${
                  call.online ? "text-green-600" : "text-gray-500"
                }`}
              >
                {call.online ? "Online" : "Offline"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default History;

