import React from 'react';

/**
 * Props for the Spinner component.
 */
export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Size multiplier of the spinner circle */
  size?: 'sm' | 'md' | 'lg';
  /** Customizable color classes */
  color?: string;
  /** Accessible title for screen readers */
  label?: string;
}

/**
 * Spinner - Reusable circular loading indicator.
 * Establishes status roles and custom sizes for async loading screens.
 *
 * @example
 * <Spinner size="md" label="Loading routes..." />
 */
export const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  (
    {
      className = '',
      size = 'md',
      color = 'text-brand-primary',
      label = 'Loading...',
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: 'w-4 h-4 border-2',
      md: 'w-8 h-8 border-3',
      lg: 'w-12 h-12 border-4',
    };

    return (
      <div
        ref={ref}
        role="status"
        aria-label={label}
        className={`inline-flex items-center justify-center ${className}`}
        {...props}
      >
        <span
          className={`
            animate-spin rounded-radius-pill border-transparent border-t-current border-r-current
            ${sizeClasses[size]}
            ${color}
          `}
        />
        <span className="sr-only">{label}</span>
      </div>
    );
  }
);

Spinner.displayName = 'Spinner';
