import { useContext, useState, createContext, useEffect } from "react";
import api from "../api/axios.js";
import { connectSocket, disconnectSocket } from "../socket.js";

// create context
const AuthContext = createContext(null);

// provider component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("accessToken"),
  );

  const [user, setUser] = useState(null);

  // fetch current user
  const fetchUser = async () => {
    try {
      const res = await api.get("/user/profile");
      setUser(res.data);
    } catch (error) {
      logout();
    }
  };

  // Login function
  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });

    const token = res.data.accessToken;
    localStorage.setItem("accessToken", token);

    setIsAuthenticated(true);

    // Connect socket immediately after login with the fresh token
    connectSocket(token);

    fetchUser();
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("accessToken");
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
      const token = localStorage.getItem("accessToken");
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
