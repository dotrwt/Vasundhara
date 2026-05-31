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
    <div className="flex flex-col sm:flex-row items-center justify-between border-t-2 border-gray-300 pt-6 mt-6 gap-4">
      <div className="text-sm font-semibold text-gray-700">
        Showing <span className="text-gray-900">{startItem}</span> to{" "}
        <span className="text-gray-900">{endItem}</span> of{" "}
        <span className="text-gray-900">{totalItems}</span> users
      </div>

      <div className="inline-flex border border-gray-400 bg-white">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 border-r border-gray-300 text-sm font-bold text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent cursor-pointer"
        >
          Previous
        </button>

        {pageNumbers.map((num) => (
          <button
            key={num}
            onClick={() => onPageChange(num)}
            className={`px-4 py-2 border-r border-gray-300 last:border-r-0 text-sm font-bold cursor-pointer ${
              currentPage === num
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            {num}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent cursor-pointer"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
