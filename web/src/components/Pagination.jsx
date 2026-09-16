import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  scrollToTop = true,
  className = ''
}) {
  if (totalPages <= 1) return null

  const handlePageClick = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return
    onPageChange(page)
    if (scrollToTop) {
      window.scrollTo({ top: 380, behavior: 'smooth' })
    }
  }

  // Calculate visible pages with ellipsis for large page sets
  const getVisiblePages = () => {
    if (totalPages <= 8) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    const pages = []
    const leftLimit = Math.max(2, currentPage - 1)
    const rightLimit = Math.min(totalPages - 1, currentPage + 1)

    pages.push(1)

    if (leftLimit > 2) {
      pages.push('...')
    }

    for (let i = leftLimit; i <= rightLimit; i++) {
      pages.push(i)
    }

    if (rightLimit < totalPages - 1) {
      pages.push('...')
    }

    pages.push(totalPages)
    return pages
  }

  const visiblePages = getVisiblePages()

  return (
    <nav className={`flex items-center justify-center gap-1.5 sm:gap-2 my-8 sm:my-10 select-none ${className}`} aria-label="Pagination">
      {/* Previous Page Button */}
      <button
        type="button"
        onClick={() => handlePageClick(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
        className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-gray-200/80 bg-white text-gray-500 flex items-center justify-center hover:border-gray-300 hover:text-gray-900 hover:bg-gray-50/80 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer shadow-[0_2px_6px_rgba(0,0,0,0.02)] active:scale-95"
      >
        <ChevronLeft size={16} />
      </button>

      {/* Number Buttons */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {visiblePages.map((page, idx) => {
          if (page === '...') {
            return (
              <span
                key={`ellipsis-${idx}`}
                className="w-7 sm:w-8 text-center text-gray-400 font-medium text-xs sm:text-sm select-none"
              >
                •••
              </span>
            )
          }

          const isActive = currentPage === page
          return (
            <button
              key={page}
              type="button"
              onClick={() => handlePageClick(page)}
              aria-label={`Go to page ${page}`}
              aria-current={isActive ? 'page' : undefined}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#0f172a] text-white shadow-md shadow-slate-900/10 scale-100'
                  : 'border border-gray-200/80 bg-white text-gray-600 hover:border-gray-300 hover:text-gray-950 hover:bg-gray-50/80 shadow-[0_2px_6px_rgba(0,0,0,0.02)] active:scale-95'
              }`}
            >
              {page}
            </button>
          )
        })}
      </div>

      {/* Next Page Button */}
      <button
        type="button"
        onClick={() => handlePageClick(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
        className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-gray-200/80 bg-white text-gray-500 flex items-center justify-center hover:border-gray-300 hover:text-gray-900 hover:bg-gray-50/80 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer shadow-[0_2px_6px_rgba(0,0,0,0.02)] active:scale-95"
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  )
}
