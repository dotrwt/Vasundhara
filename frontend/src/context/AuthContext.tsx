import React, { createContext, useContext, useState, useEffect } from "react";
import { Admin } from "../types";
import { apiGetMe } from "../api/auth";

interface AuthContextType {
  token: string | null;
  admin: Admin | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (token: string, admin: Admin) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("access_token"));
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const isAuthenticated = !!token;

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("access_token");
      if (storedToken) {
        try {
          setToken(storedToken);
          const response = await apiGetMe();
          if (response.success && response.data) {
            setAdmin(response.data);
          } else {
            // Token is invalid
            handleLogout();
          }
        } catch (error) {
          console.error("Auth validation error:", error);
          handleLogout();
        }
      } else {
        setToken(null);
        setAdmin(null);
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const handleLogin = (newToken: string, newAdmin: Admin) => {
    localStorage.setItem("access_token", newToken);
    setToken(newToken);
    setAdmin(newAdmin);
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setToken(null);
    setAdmin(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        admin,
        isLoading,
        isAuthenticated,
        login: handleLogin,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
