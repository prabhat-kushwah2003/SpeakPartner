import { useContext, useState, createContext, useEffect } from "react";
import api from "../api/axios.js";

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
      const res = await api.get("/user/profile")
      // const res = await api.get("/user/profile", {
      //   headers: {
      //     Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      //   },
      // });

      setUser(res.data);
    } catch (error) {
      logout();
    }
  };

  // Login function
  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });

    localStorage.setItem("accessToken", res.data.accessToken);
    // localStorage.setItem("token", res.data.accessToken) // *

    setIsAuthenticated(true);

    fetchUser();
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("accessToken");
    // localStorage.removeItem("token")
    setIsAuthenticated(false);
    setUser(null);
  };

  // *
  const updateUser = (updatedUser) => {
    setUser(updatedUser)
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchUser();
    }
  }, [isAuthenticated]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        updateUser
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
