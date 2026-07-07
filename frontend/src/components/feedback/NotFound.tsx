import React from 'react';
import { Search } from '../icons';
import { Button } from '../ui/Button';

/**
 * Props for the NotFound component.
 */
export interface NotFoundProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The main error title */
  title?: string;
  /** Detailed descriptions */
  message?: string;
  /** Optional CTA trigger action button */
  action?: React.ReactNode;
}

/**
 * NotFound - Reusable presentational view for broken links or missing resources (404).
 *
 * @example
 * <NotFound />
 */
export const NotFound = React.forwardRef<HTMLDivElement, NotFoundProps>(
  (
    {
      className = '',
      title = 'Page Not Found',
      message = "The link you followed may be broken, or the page has been removed.",
      action,
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
        <div className="mb-4 inline-flex items-center justify-center p-3 bg-slate-100 dark:bg-slate-800 rounded-radius-pill shrink-0">
          <Search className="w-10 h-10 text-neutral-textSub" />
        </div>
        <h3 className="text-h3 font-bold text-neutral-textMain dark:text-slate-100 mb-2">
          {title}
        </h3>
        <p className="text-small text-neutral-textSub dark:text-slate-400 mb-6 max-w-[320px]">
          {message}
        </p>
        {action || (
          <Button variant="secondary" onClick={() => window.location.href = '/'}>
            Return Home
          </Button>
        )}
      </div>
    );
  }
);

NotFound.displayName = 'NotFound';
