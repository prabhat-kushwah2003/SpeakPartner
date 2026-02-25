import { useContext, useState, createContext, useEffect } from "react";
import api from "../api/axios.js";
import { connectSocket, disconnectSocket } from "../socket.js";

// create context
const AuthContext = createContext(null);

// provider component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!sessionStorage.getItem("accessToken"),
  );

  const [user, setUser] = useState(null);

  // fetch current user
  const fetchUser = async () => {
    try {
      const res = await api.get("/user/profile");
      setUser(res.data);
    } catch (error) {
      // Don't call logout() here — the axios interceptor handles 401 refresh.
      // Only clear auth state if we truly can't recover.
      if (error.response?.status === 401) {
        setIsAuthenticated(false);
        setUser(null);
      }
    }
  };

  // Login function
  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });

    const { accessToken, refreshToken } = res.data;
    sessionStorage.setItem("accessToken", accessToken);
    sessionStorage.setItem("refreshToken", refreshToken);

    setIsAuthenticated(true);

    // Connect socket immediately after login with the fresh token
    connectSocket(accessToken);

    fetchUser();
  };

  // Logout function
  const logout = async () => {
    // Call backend to invalidate refresh token
    try {
      const refreshToken = sessionStorage.getItem("refreshToken");
      if (refreshToken) {
        await api.post("/auth/logout", { refreshToken });
      }
    } catch (e) {
      // Ignore errors — we're logging out anyway
    }

    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");
    // NOTE: Do NOT remove loginTimestamp — timer should persist across logout
    setIsAuthenticated(false);
    setUser(null);

    // Disconnect socket on logout so user goes offline
    disconnectSocket();
  };

  // *
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchUser();
      // Reconnect socket on page refresh if already authenticated
      const token = sessionStorage.getItem("accessToken");
      if (token) {
        connectSocket(token);
      }
    }
  }, [isAuthenticated]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// custom hook
export const useAuth = () => {
  return useContext(AuthContext);
};

