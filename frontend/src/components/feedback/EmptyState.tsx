import React from 'react';
import { AlertCircle } from '../icons';

/**
 * Props for the EmptyState component.
 */
export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Lucide Icon component to render at the top */
  icon?: React.ReactNode;
  /** Primary bold header title */
  title: string;
  /** Secondary detailed message explaining what to do next */
  description: string;
  /** Optional CTA Button element */
  action?: React.ReactNode;
}

/**
 * EmptyState - Presentational layout display when queries yield empty lists.
 * Suggests actions to help users resolve the empty state context.
 *
 * @example
 * <EmptyState
 *   title="No active routes found"
 *   description="Try adjusting search parameters or create a new route!"
 *   action={<Button onClick={handleReset}>Reset Filters</Button>}
 * />
 */
export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  (
    {
      className = '',
      icon = <AlertCircle className="w-12 h-12 text-neutral-textSub" />,
      title,
      description,
      action,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={`flex flex-col items-center justify-center text-center p-8 border border-dashed border-neutral-borderLine dark:border-slate-800 rounded-radius-lg bg-neutral-surface dark:bg-slate-900 shadow-shadow-small max-w-md mx-auto ${className}`}
        {...props}
      >
        <div className="mb-4 inline-flex items-center justify-center shrink-0">
          {icon}
        </div>
        <h3 className="text-h3 font-bold text-neutral-textMain dark:text-slate-100 mb-2">
          {title}
        </h3>
        <p className="text-small text-neutral-textSub dark:text-slate-400 mb-6 max-w-[320px]">
          {description}
        </p>
        {action && <div className="inline-flex shrink-0">{action}</div>}
      </div>
    );
  }
);

EmptyState.displayName = 'EmptyState';
