import React from 'react';

/**
 * Props for the Badge component.
 */
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Design color variant of the tag */
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
}

/**
 * Badge - Reusable pill badge to indicate state tags, route categories, or contribution rules.
 *
 * @example
 * <Badge variant="success">Active</Badge>
 */
export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className = '', variant = 'default', ...props }, ref) => {
    const variantStyles = {
      default: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border-neutral-borderLine dark:border-slate-700',
      primary: 'bg-blue-50 text-brand-primary dark:bg-blue-900/30 dark:text-blue-400 border-blue-100 dark:border-blue-900/50',
      success: 'bg-green-50 text-brand-success dark:bg-green-900/30 dark:text-green-400 border-green-100 dark:border-green-900/50',
      warning: 'bg-amber-50 text-brand-warning dark:bg-amber-900/30 dark:text-brand-warning border-amber-100 dark:border-amber-900/50',
      danger: 'bg-red-50 text-brand-error dark:bg-red-900/30 dark:text-red-400 border-red-100 dark:border-red-900/50',
    };

    return (
      <span
        ref={ref}
        className={`
          inline-flex items-center rounded-radius-pill border px-2.5 py-0.5 text-tiny font-semibold transition-colors duration-theme-fast select-none
          ${variantStyles[variant]}
          ${className}
        `}
        {...props}
      />
    );
  }
);

Badge.displayName = 'Badge';
