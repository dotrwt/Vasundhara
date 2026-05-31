import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { LogOut, User, Sun, Moon } from "lucide-react";
import { toast } from "sonner";
import vasundharaLogo from "../assets/Vasundhara_logo2.png";

export const Navbar: React.FC = () => {
  const { admin, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-4 sm:px-6 py-3 flex items-center justify-between transition-colors duration-300">
      <div className="flex items-center gap-2 sm:gap-3">
        <img
          src={vasundharaLogo}
          alt="Vasundhara Logo"
          className="h-8 sm:h-10 w-auto object-contain dark:brightness-110"
        />
        <div className="border-l border-gray-300 dark:border-gray-700 pl-2 sm:pl-3">
          <h1 className="text-base sm:text-xl font-black tracking-tight text-gray-900 dark:text-white leading-none">
            VASUNDHARA
          </h1>
          <p className="text-[9px] sm:text-[10px] text-gray-500 dark:text-gray-400 font-bold tracking-wider mt-0.5 uppercase hidden xs:block">
            LAND RECORDS AND AUDITING
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {admin && (
          <div className="flex items-center gap-4 mr-2">
            <button
              onClick={() => navigate("/dashboard")}
              className="text-[10px] md:text-xs font-bold text-gray-600 dark:text-gray-300 hover:text-earth dark:hover:text-gold uppercase tracking-widest transition-colors cursor-pointer"
            >
              Land Records
            </button>
          </div>
        )}

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="h-10 w-10 flex items-center justify-center border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-all duration-200 rounded-md cursor-pointer shadow-sm hover:scale-105"
          title={`Switch to ${theme === "light" ? "Dark" : "Light"} Mode`}
        >
          {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </button>

        {admin && (
          <div className="hidden md:flex items-center gap-2 border-r border-gray-200 dark:border-gray-800 pr-4 text-sm text-gray-600 dark:text-gray-300">
            <User className="h-4 w-4 text-gray-400" />
            <span>
              Welcome, <strong className="font-semibold text-gray-800 dark:text-gray-100">{admin.name}</strong>
            </span>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="h-10 px-4 border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold flex items-center gap-2 text-xs uppercase tracking-wider transition-all duration-200 rounded-md cursor-pointer shadow-sm"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
