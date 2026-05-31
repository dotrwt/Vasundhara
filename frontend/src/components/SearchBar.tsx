import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = "Search...",
}) => {
  const [searchTerm, setSearchTerm] = useState(value);

  // Sync internal state with prop changes
  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  // Debounce the change handler
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchTerm !== value) {
        onChange(searchTerm);
      }
    }, 400);

    return () => clearTimeout(handler);
  }, [searchTerm, onChange, value]);

  return (
    <div className="relative w-full max-w-md">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-500" />
      </div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="block w-full pl-10 pr-3 py-2 border-2 border-gray-400 bg-white placeholder-gray-500 text-gray-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 sm:text-base h-11"
        placeholder={placeholder}
      />
    </div>
  );
};

export default SearchBar;
