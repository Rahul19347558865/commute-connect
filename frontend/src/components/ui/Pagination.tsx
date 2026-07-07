import React from 'react';
import { ChevronLeft, ChevronRight } from '../icons';
import { Button } from './Button';

/**
 * Props for the Pagination component.
 */
export interface PaginationProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The currently active index page (1-based) */
  currentPage: number;
  /** Total count of pages available */
  totalPages: number;
  /** Handler fired when selection indices change */
  onPageChange: (page: number) => void;
  /** Disables click actions on paging controls */
  disabled?: boolean;
}

/**
 * Pagination - Reusable page list navigation layout.
 * Exposes next, previous, and index markers supporting screen reader accessibility labels.
 *
 * @example
 * <Pagination
 *   currentPage={page}
 *   totalPages={10}
 *   onPageChange={(p) => setPage(p)}
 * />
 */
export const Pagination = React.forwardRef<HTMLDivElement, PaginationProps>(
  (
    {
      className = '',
      currentPage,
      totalPages,
      onPageChange,
      disabled = false,
      ...props
    },
    ref
  ) => {
    const isPrevDisabled = currentPage <= 1 || disabled;
    const isNextDisabled = currentPage >= totalPages || disabled;

    // Generates visual page page-number array centered around current selection
    const getPageNumbers = () => {
      const pages: number[] = [];
      const range = 2; // Offset range showing before/after current index

      let start = Math.max(1, currentPage - range);
      let end = Math.min(totalPages, currentPage + range);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      return pages;
    };

    if (totalPages <= 1) return null;

    return (
      <nav
        ref={ref}
        role="navigation"
        aria-label="Pagination Navigation"
        className={`flex items-center justify-center gap-1.5 py-4 ${className}`}
        {...props}
      >
        {/* Previous Button */}
        <Button
          variant="ghost"
          size="sm"
          disabled={isPrevDisabled}
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="Go to previous page"
          leftIcon={<ChevronLeft className="w-4 h-4" />}
        >
          Prev
        </Button>

        {/* Page index selectors */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((page) => {
            const isActive = page === currentPage;
            return (
              <Button
                key={page}
                variant={isActive ? 'primary' : 'ghost'}
                size="sm"
                className="w-8 h-8 p-0"
                onClick={() => onPageChange(page)}
                disabled={disabled}
                aria-label={`Go to page ${page}`}
                aria-current={isActive ? 'page' : undefined}
              >
                {page}
              </Button>
            );
          })}
        </div>

        {/* Next Button */}
        <Button
          variant="ghost"
          size="sm"
          disabled={isNextDisabled}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="Go to next page"
          rightIcon={<ChevronRight className="w-4 h-4" />}
        >
          Next
        </Button>
      </nav>
    );
  }
);

Pagination.displayName = 'Pagination';
