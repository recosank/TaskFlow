import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import {
  setAccessToken,
  getAccessToken,
  clearAccessToken,
} from "../api/authMemory";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/ui/Spinner";
import { useQueryClient } from "@tanstack/react-query";
import type { AuthContextType, User } from "@/lib/types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [authReady, setAuthReady] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    let isActive = true;

    const initializeAuth = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newToken = response.data?.accessToken;
        const userData = response.data?.user ?? null;

        if (newToken && userData) {
          setAccessToken(newToken);
          if (isActive) setUser(userData);
        } else {
          clearAccessToken();
          if (isActive) setUser(null);
        }
      } catch {
        const existingToken = getAccessToken();
        if (existingToken) {
          if (isActive) setUser(null);
        } else {
          if (isActive) setUser(null);
        }
      } finally {
        if (isActive) setAuthReady(true);
      }
    };

    initializeAuth();

    return () => {
      isActive = false;
    };
  }, []);

  const login = async (email: string, password: string) => {
    queryClient.clear();
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/auth/login`,

      { email, password },
      { withCredentials: true }
    );

    const token = response.data?.accessToken;
    const userData = response.data?.user ?? null;

    if (!token) {
      throw new Error("Login failed: No access token received");
    }

    setAccessToken(token);
    setUser(userData);
  };

  const logout = async () => {
    try {
      queryClient.clear();
      await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/logout`,
        {},
        { withCredentials: true }
      );
    } finally {
      clearAccessToken();
      setUser(null);
      navigate("/login");
    }
  };

  if (!authReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner label="Restoring session..." />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ setUser, user, authReady, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
