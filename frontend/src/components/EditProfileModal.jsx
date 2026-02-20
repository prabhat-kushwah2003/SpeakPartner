import { useRef, useState } from "react";
import { X } from "lucide-react";
import { useAuth } from "../auth/AuthContext";
import { useEffect } from "react";
import api from "../api/axios.js";

function EditProfileModal({ isOpen, onClose }) {
  const fileRef = useRef(null);

  const { user, updateUser } = useAuth();

  const [preview, setPreview] = useState("");
  const [username, setUsername] = useState("");
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (user) {
      setPreview(`${import.meta.env.VITE_API_URL}${user.avatar}`); // *
      setUsername(user.username);
    }
  }, [user]);

  if (!isOpen) return null;

  // open file picker
  const openFilePicker = () => {
    fileRef.current.click();
  };

  // preview selected image
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFile(file); // *
    setPreview(URL.createObjectURL(file));
  };

  // save button logic
  const handleSave = async () => {
    // *
    try {
      // Update username
      const profileRes = await api.put("/user/profile", { username });

      let updatedUser = profileRes.data;

      // Upload avatar
      if (file) {
        const formData = new FormData();
        formData.append("avatar", file);

        const avatarRes = await api.post("/user/avatar", formData);

        updatedUser.avatar = avatarRes.data.avatar;
      }

      // it render header so that same time header also change profile and username
      updateUser(updatedUser);

      console.log("Profile updated");
      onClose();

      // let updated = { ...user };

      // // upload avatar if selected
      // if (file) {
      //   const formData = new FormData();
      //   formData.append("avatar", file);

      //   const res = await api.post("/user/avatar", formData, {
      //     headers: { "Content-Type": "multipart/form-data" },
      //   });
      //   updated.avatar = res.data.avatar;
      // }
      // updated.username = username;

      // updateUser(updated);
      // console.log("Profile updated");

      // onClose();
    } catch (error) {
      console.log("Update failed:", error);
    }

    // console.log("Username:", username);
    // console.log("Profile updated");

    // // close modal
    // onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
      onClick={onClose}
    >
      {/* Modal Box */}
      <div
        className="bg-white w-[420px] rounded-2xl p-6 relative shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Icon */}
        <X
          className="absolute right-5 top-5 cursor-pointer text-gray-500"
          onClick={onClose}
        />

        {/* Title */}
        <h2 className="text-xl font-bold mb-6">Edit Profile</h2>

        {/* Avatar */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={preview}
            alt="avatar"
            onClick={openFilePicker}
            className="w-28 h-28 rounded-full object-cover shadow cursor-pointer hover:opacity-80"
          />

          <button
            onClick={openFilePicker}
            className="text-purple-600 text-sm mt-3 font-medium hover:underline"
          >
            Change Photo
          </button>
        </div>

        {/* Hidden File Input */}
        <input
          type="file"
          accept="image/*"
          ref={fileRef}
          onChange={handleFileChange}
          hidden
        />

        {/* Username */}
        <label className="text-sm text-gray-600">Username</label>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border rounded-xl p-3 mt-2 mb-6 outline-none"
        />

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-xl font-semibold"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}

export default EditProfileModal;
