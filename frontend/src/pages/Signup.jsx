import { useState } from "react";
import api from "../api/axios.js";
import { Link } from "react-router-dom";
import { User, Mail, Lock, Eye } from "lucide-react";

function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // call backend signup api
      await api.post("/auth/signup", {
        username,
        email,
        password,
      });

      // if success
      setSuccess("Signup successful. Please login.");
      setUsername("");
      setEmail("");
      setPassword("");
    } catch (error) {
      setError("Signup failed. Email may already exist.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-[380px] rounded-2xl shadow-lg p-6"
      >
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white w-10 h-10 flex items-center justify-center rounded-xl font-bold shadow-md">
            E
          </div>
        </div>

        <h2 className="text-xl font-bold text-center">Create an account</h2>
        <p className="text-gray-500 text-center mb-4 text-sm">
          Start your language learning journey today.
        </p>

        {/* error */}
        {error && (
          <p className="text-red-500 text-sm text-center mb-2">{error}</p>
        )}

        {/* success */}
        {success && (
          <p className="text-green-600 text-sm text-center mb-2">{success}</p>
        )}

        {/* Username */}
        <label className="text-sm font-medium">Full Name</label>
        <div className="flex items-center border rounded-lg px-3 mt-1 mb-3">
          <User size={16} className="text-gray-400" />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full p-2 outline-none"
          />
        </div>

        {/* Email */}
        <label className="text-sm font-medium">Email address</label>
        <div className="flex items-center border rounded-lg px-3 mt-1 mb-3">
          <Mail size={16} className="text-gray-400" />
          <input
            type="email"
            placeholder="name@gamil.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 outline-none"
          />
        </div>

        {/* Password */}
        <label className="text-sm font-medium">Password</label>
        <div className="flex items-center border rounded-lg px-3 mt-1 mb-3">
          <Lock size={16} className="text-gray-400" />
          <input
            type="password"
            placeholder="Create a strong password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 outline-none"
          />
          <Eye size={16} className="text-gray-400 cursor-pointer" />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2 rounded-xl font-semibold hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Signing up..." : "Create Account"}
        </button>

        {/* Login Link */}
        <p className="text-center text-xs mt-4">
          Already have an account?{" "}
          <Link to="/" className="text-purple-600 font-medium">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;
