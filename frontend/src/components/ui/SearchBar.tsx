import React, { useId } from 'react';
import { Search, X } from '../icons';

/**
 * Props for the SearchBar component.
 */
export interface SearchBarProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Optional text label displayed above the search input */
  label?: string;
  /** Callback triggered when search text clearing or inputs change */
  onClear?: () => void;
}

/**
 * SearchBar - Reusable generic search input bar.
 * Integrates search graphic layout and custom styling tags.
 *
 * @example
 * <SearchBar
 *   placeholder="Search locations..."
 *   value={query}
 *   onChange={(e) => setQuery(e.target.value)}
 * />
 */
export const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(
  ({ className = '', label, onClear, id, ...props }, ref) => {
    const generatedId = useId();
    const searchId = id || generatedId;

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={searchId}
            className="text-small font-medium text-neutral-textMain dark:text-slate-200 select-none cursor-pointer"
          >
            {label}
          </label>
        )}

        <div className="relative w-full">
          {/* Search Icon on left */}
          <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center text-neutral-textSub pointer-events-none">
            <Search className="w-4 h-4" aria-hidden="true" />
          </div>

          <input
            id={searchId}
            ref={ref}
            type="text"
            className={`
              w-full h-10 pl-9 ${onClear ? 'pr-10' : 'pr-3'} text-small rounded-radius-md border border-neutral-borderLine dark:border-slate-800 bg-neutral-surface dark:bg-slate-900 text-neutral-textMain dark:text-slate-100 placeholder:text-neutral-textSub placeholder:opacity-70 outline-none transition-colors duration-theme-fast
              focus-visible:ring-1 focus-visible:ring-brand-primary focus-visible:border-brand-primary
              disabled:opacity-50 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:pointer-events-none
              ${className}
            `}
            {...props}
          />

          {onClear && props.value && (
            <button
              type="button"
              onClick={onClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center text-neutral-textSub hover:text-neutral-textMain rounded-radius-sm focus-visible:ring-1 focus-visible:ring-brand-primary outline-none cursor-pointer"
              aria-label="Clear search text"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  }
);

SearchBar.displayName = 'SearchBar';
