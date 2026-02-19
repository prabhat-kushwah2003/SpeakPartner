import { Home, Users, LogOut, Target } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";

const Sidebar = () => {

  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    // localStorage.removeItem("token");
    logout()
    navigate("/");
  }
  const activeClass =
    "flex items-center gap-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-3 rounded-xl shadow";

  const normalClass =
    "flex items-center gap-3 text-gray-600 hover:bg-gray-100 px-4 py-3 rounded-xl";

  return (
    <div className="h-screen w-64 bg-white flex flex-col justify-between p-5 border-r">
      {/* Top Logo */}
      <div>
        <div className="flex items-center gap-3 mb-10">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white w-11 h-11 flex items-center justify-center rounded-xl font-bold text-lg shadow">
            SP
          </div>

          <div>
            <h1 className="font-bold text-lg">SpeakPartner</h1>
            <p className="text-xs text-indigo-500 font-medium">LEARNING</p>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex flex-col gap-3">
          {/* Dashboard */}
          <NavLink
            to="/dashboard"
            className={({ isActive }) => (isActive ? activeClass : normalClass)}
          >
            <Home size={20} />
            Dashboard
          </NavLink>

          {/* Find Tutors */}
          <NavLink
            to="/find-learners"
            className={({ isActive }) => (isActive ? activeClass : normalClass)}
          >
            <Users size={20} />
            Online Learners
          </NavLink>
        </nav>

        {/* Daily Time Spent */}
        {/* Today's Time Spent */}
        <div className="mt-10 bg-gray-50 rounded-xl p-4 border">
          <div className="flex items-center gap-2 mb-2">
            <Target className="text-purple-600" size={18} />
            <p className="font-semibold">Today's Time</p>
          </div>

          {/* Minutes Only */}
          <p className="text-lg font-semibold text-gray-700 mb-2">32 mins</p>

          <p className="text-xs text-gray-400">Time spent learning today</p>
        </div>
      </div>

      {/* Logout */}
      <button onClick={handleLogout} className="flex items-center gap-3 text-gray-600 hover:bg-gray-100 px-4 py-3 rounded-xl">
        <LogOut size={20} />
        Log Out
      </button>
    </div>
  );
};

export default Sidebar;
