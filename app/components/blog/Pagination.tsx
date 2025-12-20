"use client";

import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ["300", "400", "500", "600", "700"],
});

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}

export default function Pagination({ currentPage, totalPages, baseUrl }: PaginationProps) {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  const getPageUrl = (page: number) => {
    if (page === 1) {
      return baseUrl;
    }
    return `${baseUrl}?page=${page}`;
  };

  return (
    <div className="flex justify-center items-center gap-2 mt-12 mb-8">
      {/* Previous Button */}
      {currentPage > 1 ? (
        <Link
          href={getPageUrl(currentPage - 1)}
          className={`flex items-center justify-center w-10 h-10 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors ${poppins.className}`}
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
      ) : (
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/5 border border-white/10 text-white/30 cursor-not-allowed">
          <ChevronLeft className="w-5 h-5" />
        </div>
      )}

      {/* Page Numbers */}
      <div className="flex items-center gap-2">
        {pageNumbers.map((page, index) => {
          if (page === '...') {
            return (
              <span
                key={`ellipsis-${index}`}
                className={`px-3 py-2 text-gray-400 ${poppins.className}`}
              >
                ...
              </span>
            );
          }

          const pageNum = page as number;
          const isActive = pageNum === currentPage;

          return (
            <Link
              key={pageNum}
              href={getPageUrl(pageNum)}
              className={`flex items-center justify-center min-w-[40px] h-10 px-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-[#FEE39A] text-black font-semibold'
                  : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
              } ${poppins.className}`}
            >
              {pageNum}
            </Link>
          );
        })}
      </div>

      {/* Next Button */}
      {currentPage < totalPages ? (
        <Link
          href={getPageUrl(currentPage + 1)}
          className={`flex items-center justify-center w-10 h-10 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors ${poppins.className}`}
        >
          <ChevronRight className="w-5 h-5" />
        </Link>
      ) : (
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/5 border border-white/10 text-white/30 cursor-not-allowed">
          <ChevronRight className="w-5 h-5" />
        </div>
      )}
    </div>
  );
}