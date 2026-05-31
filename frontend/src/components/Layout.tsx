import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans antialiased text-gray-900">
      {/* Header / Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-300 py-4 px-6 mt-12 text-center text-xs text-gray-500 font-medium">
        © {new Date().getFullYear()} National Land Information & Auditing Portal. All Rights Reserved.
      </footer>
    </div>
  );
};

export default Layout;
