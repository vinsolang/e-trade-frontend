
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");

  // const API_URL = "http://localhost:8081/api/auth";
   const API_URL = "https://e-trade-project-production.up.railway.app/api/auth";

  //  Safe helper for parsing JSON
  const safeParseJSON = (value) => {
    try {
      return value ? JSON.parse(value) : null;
    } catch {
      console.warn("Invalid JSON in localStorage for 'user'");
      return null;
    }
  };

  //  Login function
  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Login failed");

      const userData = {
        username: data.username || data.user?.username,
        email: data.email || data.user?.email,
        role: data.role || data.user?.role,
      };
      
      //  Save a valid user object
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      setIsAuthenticated(true);
      window.location.reload();
      return userData;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  //  Register function
  const register = async (username, email, password, confirmPassword, role = "customer") => {
    try {
      const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, confirmPassword, role }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  //  Logout function
  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
  };

  // Check stored user on mount
  useEffect(() => {
    const storedUser = safeParseJSON(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

