import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogOut, User } from "lucide-react";
import { toast } from "sonner";

export const Navbar: React.FC = () => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <header className="bg-white border-b-2 border-gray-300 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="bg-gray-100 p-2 border border-gray-300">
          <span className="font-bold text-gray-900 text-lg uppercase tracking-wider">UMS</span>
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900 leading-none">User Management System</h1>
          <p className="text-xs text-gray-500 font-semibold mt-1">GOVERNMENT OF INDIA • LAND RECORDS AND AUDITING</p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {admin && (
          <div className="flex items-center gap-2 border-r border-gray-300 pr-6 text-sm text-gray-700">
            <User className="h-4 w-4 text-gray-500" />
            <span className="font-medium text-gray-900">
              Welcome, <strong className="font-bold">{admin.name}</strong> ({admin.email})
            </span>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="h-10 px-4 border border-gray-400 bg-gray-50 hover:bg-gray-100 active:bg-gray-200 text-gray-800 font-semibold flex items-center gap-2 text-sm uppercase tracking-wider cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
