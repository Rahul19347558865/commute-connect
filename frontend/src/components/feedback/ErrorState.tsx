import React from 'react';
import { AlertTriangle } from '../icons';
import { Button } from '../ui/Button';

/**
 * Props for the ErrorState component.
 */
export interface ErrorStateProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The error title */
  title?: string;
  /** Detailed error message details */
  message?: string;
  /** Callback triggered when clicking the "Try Again" action button */
  onRetry?: () => void;
  /** Text label for the retry button */
  retryLabel?: string;
}

/**
 * ErrorState - Presentational component for gracefully handling and displaying API/Network failures.
 *
 * @example
 * <ErrorState
 *   message="We couldn't load available routes. Please check your connection."
 *   onRetry={refetchData}
 * />
 */
export const ErrorState = React.forwardRef<HTMLDivElement, ErrorStateProps>(
  (
    {
      className = '',
      title = 'Something went wrong',
      message = "We couldn't retrieve the requested data. Please try again.",
      onRetry,
      retryLabel = 'Try Again',
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={`flex flex-col items-center justify-center text-center p-8 border border-neutral-borderLine dark:border-slate-800 rounded-radius-lg bg-neutral-surface dark:bg-slate-900 shadow-shadow-small max-w-md mx-auto ${className}`}
        {...props}
      >
        <div className="mb-4 inline-flex items-center justify-center p-3 bg-red-50 dark:bg-red-950/30 rounded-radius-pill shrink-0">
          <AlertTriangle className="w-10 h-10 text-brand-error" />
        </div>
        <h3 className="text-h3 font-bold text-neutral-textMain dark:text-slate-100 mb-2">
          {title}
        </h3>
        <p className="text-small text-neutral-textSub dark:text-slate-400 mb-6 max-w-[320px]">
          {message}
        </p>
        {onRetry && (
          <Button variant="danger" onClick={onRetry} className="shrink-0">
            {retryLabel}
          </Button>
        )}
      </div>
    );
  }
);

ErrorState.displayName = 'ErrorState';
