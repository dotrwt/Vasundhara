import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 border border-gray-300 m-4">
        <div className="text-center p-8 border border-gray-300 bg-white max-w-sm">
          <p className="text-base font-bold text-gray-900">VERIFYING CREDENTIALS</p>
          <p className="text-sm text-gray-600 mt-2">Please wait while we confirm your session status...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
