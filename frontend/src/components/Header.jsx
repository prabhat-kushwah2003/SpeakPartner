import { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext.jsx";
import EditProfileModal from "../components/EditProfileModal.jsx";

function Header() {
  const { user } = useAuth();

  const [preview, setPreview] = useState(""); //*
  // modal state
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => { // *
    if (user) {
      setPreview(user?.avatar);
    }
  }, [user]);

  return (
    <>
      <header className="h-20 bg-white border-b px-8 flex items-center justify-between">
        {/* Left side */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Welcome</h2>
          <p className="text-sm text-gray-500">Sunday, February 1, 2026</p>
        </div>

        {/* Right side - PROFILE SECTION */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-800">
              {user?.username || "username"}
            </p>
            <p className="text-xs text-gray-500">
              {user?.email || "email@example.com"}
            </p>
          </div>

          {/* Avatar Clickable */}
          <img
            src={
              user?.avatar
                ? `http://localhost:5000${user.avatar}`
                : "https://i.pravatar.cc/40"
            }
            // src={preview}
            alt="avatar"
            onClick={() => setOpenModal(true)}
            className="w-11 h-11 rounded-full border-2 border-purple-500 cursor-pointer"
          />
        </div>
      </header>

      {/* Modal */}
      <EditProfileModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
      />
    </>
  );
}

export default Header;
