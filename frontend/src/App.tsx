import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import { Toaster } from "sonner";
import { ThemeProvider } from "./context/ThemeContext";

// Lazy loaded page components
const LandingPage = lazy(() => import("./pages/LandingPage"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const CreateUser = lazy(() => import("./pages/CreateUser"));
const EditUser = lazy(() => import("./pages/EditUser"));
const ViewUser = lazy(() => import("./pages/ViewUser"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Premium Suspense fallback loading indicator
const PageLoader: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <div className="text-center">
      <div className="relative inline-flex mb-4">
        <div className="w-12 h-12 rounded-full border-4 border-blue-200 dark:border-gray-800"></div>
        <div className="w-12 h-12 rounded-full border-4 border-blue-600 dark:border-gold animate-spin border-t-transparent absolute top-0 left-0"></div>
      </div>
      <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest animate-pulse">
        Loading Vasundhara...
      </p>
    </div>
  </div>
);

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public Landing Page */}
            <Route path="/" element={<LandingPage />} />

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
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
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
    </ThemeProvider>
  );
};

export default App;
