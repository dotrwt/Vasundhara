import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Compass, Home, ArrowLeft } from "lucide-react";

export const NotFound: React.FC = () => {
  useEffect(() => {
    document.title = "404 Page Not Found — Vasundhara";
  }, []);

  return (
    <div className="min-h-screen bg-cream dark:bg-gray-950 text-ink dark:text-white flex flex-col items-center justify-center p-6 selection:bg-gold/30 selection:text-ink">
      <div className="text-center max-w-md space-y-6">
        
        {/* Animated Compass Icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full border border-earth/20 dark:border-white/10 bg-white dark:bg-gray-900 flex items-center justify-center text-earth dark:text-gold shadow-lg animate-spin-slow">
            <Compass className="h-10 w-10" />
          </div>
        </div>

        {/* 404 Content */}
        <div className="space-y-2">
          <h1 className="font-serif text-8xl font-black text-earth dark:text-gold leading-none">
            404
          </h1>
          <h2 className="text-xs font-bold text-muted-custom dark:text-gray-400 uppercase tracking-[0.2em]">
            Registry Location Uncharted
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-4 leading-relaxed">
            The page, land survey coordinates, or dashboard asset you are requesting does not exist in the Vasundhara registry.
          </p>
        </div>

        {/* Navigation Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Link
            to="/"
            className="h-11 px-5 bg-earth hover:bg-earth-mid text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 rounded-md transition-all shadow-md cursor-pointer"
          >
            <Home className="h-3.5 w-3.5" />
            Return Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="h-11 px-5 border border-earth/20 dark:border-white/15 hover:border-earth/40 dark:hover:border-white/30 text-earth dark:text-gold font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 rounded-md transition-all cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Go Back
          </button>
        </div>
        
      </div>
    </div>
  );
};

export default NotFound;
