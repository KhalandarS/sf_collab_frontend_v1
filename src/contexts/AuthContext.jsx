import React, { createContext, useContext, useState, useEffect } from "react";
import { SimpleOAuthService } from "../services/simpleOAuthService";
import { useSocket } from "./SocketContext";
import axios from "axios";

const API_URL_AUTH = import.meta.env.VITE_API_URL_AUTH || 'http://localhost:5001/api/auth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { disconnectSocket } = useSocket();

  // Check for existing authentication on app load
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userData = localStorage.getItem("userData");

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("authToken");
        localStorage.removeItem("userData");
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const response = await fetch(
        `${API_URL_AUTH}/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // keep if you want cookies
          body: JSON.stringify(credentials),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Login failed");
      }

      const data = await response.json();

      // ✅ match your backend
      const token = data.tokens?.accessToken; // <- correct path
      const userData = data.user;

      if (!token) {
        throw new Error("No access token returned from server");
      }

      localStorage.setItem("authToken", token);
      localStorage.setItem("userData", JSON.stringify(userData));

      setUser(userData);
      setIsAuthenticated(true);

      return { success: true, user: userData };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: error.message };
    }
  };

  const signup = async (userData) => {
    try {
      // POST to your backend
      const response = await axios.post(
        `${API_URL_AUTH}/signup`,
        userData,
        { withCredentials: true } // ensure cookies allowed if backend sets them
      );

      // Your backend returns status 201 and body { message, user, tokens }
      if (response.status === 201 && response.data?.user) {
        const returnedUser = response.data.user;
        const tokens = response.data.tokens || {};

        // Save tokens and user (adjust keys if your backend uses different names)
        if (tokens.accessToken)
          localStorage.setItem("authToken", tokens.accessToken);
        if (tokens.refreshToken)
          localStorage.setItem("refreshToken", tokens.refreshToken);

        localStorage.setItem("userData", JSON.stringify(returnedUser));

        // Update context state so ProtectedRoute sees user is authenticated
        setUser(returnedUser);
        setIsAuthenticated(true);

        return { success: true, user: returnedUser, tokens };
      }

      // fallback error
      return { success: false, error: response.data?.error || "Signup failed" };
    } catch (err) {
      console.error(
        "Signup error (AuthContext):",
        err.response?.data || err.message
      );
      return {
        success: false,
        error: err.response?.data?.message || err.message || "Signup failed",
      };
    }
  };

  const loginWithGoogle = async () => {
    try {
      // Start OAuth flow - this will redirect to Google
      SimpleOAuthService.startOAuthFlow();
      return { success: true };
    } catch (error) {
      console.error("Google login error:", error);
      return { success: false, error: error.message };
    }
  };

  const handleOAuthCallback = async () => {
    try {
      const result = SimpleOAuthService.handleOAuthCallback();

      if (result.success) {
        // Store authentication data
        localStorage.setItem("authToken", result.tokens.access_token);
        localStorage.setItem("userData", JSON.stringify(result.user));

        setUser(result.user);
        setIsAuthenticated(true);

        return { success: true, user: result.user };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error("OAuth callback error:", error);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    localStorage.removeItem("refreshToken");
    disconnectSocket?.();
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    signup,
    loginWithGoogle,
    handleOAuthCallback,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
