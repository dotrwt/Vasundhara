import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateUser from "./pages/CreateUser";
import EditUser from "./pages/EditUser";
import ViewUser from "./pages/ViewUser";
import { Toaster } from "sonner";

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/users/new" element={<CreateUser />} />
              <Route path="/users/:id" element={<ViewUser />} />
              <Route path="/users/:id/edit" element={<EditUser />} />
            </Route>
          </Route>

          {/* Fallback Redirects */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster
        richColors
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: "0px",
            border: "2px solid #374151",
            fontFamily: "sans-serif",
          },
        }}
      />
    </AuthProvider>
  );
};

export default App;
