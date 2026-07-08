import React from 'react';
import { Lock } from '../icons';
import { Button } from '../ui/Button';

/**
 * Props for the Unauthorized component.
 */
export interface UnauthorizedProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Access denied header title */
  title?: string;
  /** Detailed error message */
  message?: string;
  /** Custom action buttons */
  action?: React.ReactNode;
}

/**
 * Unauthorized - Presentational container representing restricted page access (401/403).
 *
 * @example
 * <Unauthorized />
 */
export const Unauthorized = React.forwardRef<HTMLDivElement, UnauthorizedProps>(
  (
    {
      className = '',
      title = 'Access Denied',
      message = "You do not have permission to access this page. Please log in or contact an administrator.",
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
        <div className="mb-4 inline-flex items-center justify-center p-3 bg-amber-50 dark:bg-amber-950/30 rounded-radius-pill shrink-0">
          <Lock className="w-10 h-10 text-brand-warning" />
        </div>
        <h3 className="text-h3 font-bold text-neutral-textMain dark:text-slate-100 mb-2">
          {title}
        </h3>
        <p className="text-small text-neutral-textSub dark:text-slate-400 mb-6 max-w-[320px]">
          {message}
        </p>
        {action || (
          <Button variant="primary" onClick={() => window.location.href = '/login'}>
            Go to Login
          </Button>
        )}
      </div>
    );
  }
);

Unauthorized.displayName = 'Unauthorized';
