import { useState } from "react";
import { useAuth } from "../auth/AuthContext.jsx";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      console.error("LOGIN PAGE ERROR:", err);

      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Login failed";

      setError(message);
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
        <div className="flex justify-center mb-4">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white w-10 h-10 flex items-center justify-center rounded-xl font-bold shadow-md">
            E
          </div>
        </div>

        <h2 className="text-xl font-bold text-center">Welcome back</h2>
        <p className="text-gray-500 text-center mb-4 text-sm">
          Please enter your details to sign in.
        </p>

        {error && (
          <p className="text-red-500 text-sm text-center mb-2">{error}</p>
        )}

        <label className="text-sm font-medium">Email address</label>
        <div className="flex items-center border rounded-lg px-3 mt-1 mb-3">
          <Mail size={16} className="text-gray-400" />
          <input
            type="email"
            placeholder="name@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 outline-none"
          />
        </div>

        <label className="text-sm font-medium">Password</label>
        <div className="flex items-center border rounded-lg px-3 mt-1 mb-2">
          <Lock size={16} className="text-gray-400" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="******"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 outline-none"
          />
          {showPassword ? (
            <EyeOff
              size={16}
              onClick={() => setShowPassword(false)}
              className="text-gray-400 cursor-pointer"
            />
          ) : (
            <Eye
              size={16}
              onClick={() => setShowPassword(true)}
              className="text-gray-400 cursor-pointer"
            />
          )}
        </div>

        <div className="flex justify-between items-center text-xs mb-3">
          <label className="flex items-center gap-1">
            <input type="checkbox" /> Remember me
          </label>
          <span className="text-purple-600 cursor-pointer">
            Forgot password?
          </span>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2 rounded-xl font-semibold hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Log in"}
        </button>

        <div className="text-center text-gray-400 my-3 text-xs">
          Or continue with
        </div>

        <button
          type="button"
          className="w-full border py-2 rounded-xl hover:bg-gray-50"
        >
          Google
        </button>

        <p className="text-center text-xs mt-4">
          Don't have an account?{" "}
          <Link to="/signup" className="text-purple-600 font-medium">
            Create account
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;