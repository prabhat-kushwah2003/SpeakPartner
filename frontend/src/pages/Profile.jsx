import { useState } from "react";
import api from "../api/axios.js";
import { useAuth } from "../auth/AuthContext";


function Profile() {
  const [file, setFile] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState("");

  const {user} = useAuth();

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("avatar", file);
    try {
      const res = await api.post("/user/avatar", formData);

      setAvatarUrl(`http://localhost5000${res.data.avatar}`);
    } catch (error) {
      alert("Upload failed");
    }
  };
  return (
    <div className="p-6">
      <h2 className="text-xl mb-4">Upload Avatar</h2>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button
        className="bg-blue-600 text-white px-4 py-2 ml-2"
        onClick={handleUpload}
      >
        Upload
      </button>

      {avatarUrl && (
        <img className="w-24 h-24 rounded-full mt-4" src={avatarUrl} />
      )}
    </div>
  );
}

export default Profile;
