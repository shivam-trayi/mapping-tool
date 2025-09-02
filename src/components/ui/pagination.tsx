import React from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { cn } from "@/lib/utils"; // adjust if cn helper is in a different path
import { useTheme } from "next-themes"; // assuming you're using next-themes for resolvedTheme

const Pagination = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
  const { resolvedTheme } = useTheme();
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const maxVisibleButtons = 5;
  const halfMaxButtons = Math.floor(maxVisibleButtons / 2);

  let startPage = Math.max(currentPage - halfMaxButtons, 1);
  const endPage = Math.min(startPage + maxVisibleButtons - 1, totalPages);

  if (totalPages - endPage < halfMaxButtons) {
    startPage = Math.max(endPage - maxVisibleButtons + 1, 1);
  }

  const pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

  const handleFirstClick = () => onPageChange(1);
  const handleLastClick = () => onPageChange(totalPages);
  const handlePrevClick = () => onPageChange(currentPage - 1);
  const handleNextClick = () => onPageChange(currentPage + 1);

  return (
    <div className="flex justify-end mt-2 sm:mt-5">
      <div className="flex justify-between items-center gap-1 sm:gap-7">
        {totalPages > 1 && (
          <button
            aria-label="previous"
            type="button"
            onClick={handlePrevClick}
            disabled={currentPage <= 1}
            className={cn(
              "text-gray-500 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed",
              resolvedTheme === "dark" ? "text-gray-400 hover:text-blue-500" : ""
            )}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {totalPages > maxVisibleButtons && (
          <button
            aria-label="first"
            type="button"
            onClick={handleFirstClick}
            disabled={currentPage === 1}
            className={cn(
              "text-gray-500 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed",
              resolvedTheme === "dark" ? "text-gray-400 hover:text-blue-500" : ""
            )}
          >
            <ChevronsLeft className="w-6 h-6" />
          </button>
        )}

        {pages.map((pageNumber) => (
          <button
            key={pageNumber}
            onClick={() => onPageChange(pageNumber)}
            className={cn(
              "rounded-full w-6 sm:w-10 h-6 sm:h-10 text-xs sm:text-base flex justify-center items-center transition-colors",
              currentPage === pageNumber
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            )}
          >
            {pageNumber}
          </button>
        ))}

        {totalPages > maxVisibleButtons && (
          <button
            aria-label="last"
            type="button"
            onClick={handleLastClick}
            disabled={currentPage === totalPages}
            className={cn(
              "text-gray-500 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed",
              resolvedTheme === "dark" ? "text-gray-400 hover:text-blue-500" : ""
            )}
          >
            <ChevronsRight className="w-6 h-6" />
          </button>
        )}

        {totalPages > 1 && (
          <button
            aria-label="next"
            type="button"
            onClick={handleNextClick}
            disabled={currentPage === totalPages}
            className={cn(
              "text-gray-500 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed",
              resolvedTheme === "dark" ? "text-gray-400 hover:text-blue-500" : ""
            )}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Pagination;
