import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import socket from "../socket";

function FindLearners() {
  const [users, setUsers] = useState([]);
  const { user } = useAuth();

  // fetch online users from backend endpoint
  const fetchOnlineUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/user/online-users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Fetch failed", error);
    }
  };

  // initial fetch on page load
  useEffect(() => {
    fetchOnlineUsers();
  }, []);

  // listen for real-time online-users updates using the shared singleton socket
  useEffect(() => {
    const handleOnlineUsers = () => {
      fetchOnlineUsers();
    };

    socket.on("online-users", handleOnlineUsers);

    return () => {
      socket.off("online-users", handleOnlineUsers);
    };
  }, []);

  // Filter out current user from the list
  const filteredUsers = users.filter((u) => u._id !== user?._id);

  return (
    <div className="p-6">
      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-800 mb-1">
        Online Community
      </h1>

      <p className="text-gray-500 mb-8">
        Connect with other learners and speakers online right now.
      </p>

      {/* Card Container */}
      <div className="bg-white border rounded-3xl p-8">
        {/* Online Users Label */}
        <div className="flex items-center gap-2 mb-6">
          <span className="w-3 h-3 bg-green-500 rounded-full"></span>
          <h2 className="text-xl font-semibold">
            Online Users ({filteredUsers.length})
          </h2>
        </div>

        {/* Users Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {Array.isArray(filteredUsers) &&
            filteredUsers.map((user) => (
              <div
                key={user._id}
                className="bg-gray-50 rounded-2xl p-8 flex flex-col items-center hover:shadow-md transition cursor-pointer"
              >
                {/* Avatar */}
                <div className="relative">
                  <img
                    src={`http://localhost:5000${user.avatar}`}
                    alt="avatar"
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow"
                  />

                  {/* Online Dot */}
                  <span className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></span>
                </div>

                {/* Username */}
                <p className="mt-4 font-semibold text-lg text-gray-800">
                  {user.username}
                </p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default FindLearners;
