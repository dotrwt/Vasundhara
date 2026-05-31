import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  limit: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  limit,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, totalItems);

  // Generate page numbers to show
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 dark:border-gray-850 pt-6 mt-6 gap-4">
      <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
        Showing <span className="text-gray-900 dark:text-white">{startItem}</span> to{" "}
        <span className="text-gray-900 dark:text-white">{endItem}</span> of{" "}
        <span className="text-gray-900 dark:text-white">{totalItems}</span> records
      </div>

      <div className="inline-flex border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md overflow-hidden shadow-sm">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 border-r border-gray-300 dark:border-gray-700 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750 disabled:opacity-55 disabled:hover:bg-transparent cursor-pointer transition-colors"
        >
          Previous
        </button>

        {pageNumbers.map((num) => (
          <button
            key={num}
            onClick={() => onPageChange(num)}
            className={`px-4 py-2 border-r border-gray-300 dark:border-gray-700 last:border-r-0 text-xs font-bold cursor-pointer transition-colors ${
              currentPage === num
                ? "bg-blue-650 dark:bg-blue-500 text-white hover:bg-blue-700"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750"
            }`}
          >
            {num}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750 disabled:opacity-55 disabled:hover:bg-transparent cursor-pointer transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
