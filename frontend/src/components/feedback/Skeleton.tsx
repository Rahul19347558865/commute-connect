import React from 'react';

/**
 * Props for the Skeleton component.
 */
export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The shape variant of the skeleton block */
  variant?: 'text' | 'circle' | 'rect';
  /** Width override value (e.g. '100%', '80px') */
  width?: string;
  /** Height override value (e.g. '16px', '150px') */
  height?: string;
}

/**
 * Skeleton - Reusable pulsing skeleton placeholder for lazy-loading cards or screens.
 *
 * @example
 * <div className="space-y-2">
 *   <Skeleton variant="circle" width="40px" height="40px" />
 *   <Skeleton variant="text" width="60%" />
 *   <Skeleton variant="rect" height="100px" />
 * </div>
 */
export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  (
    {
      className = '',
      variant = 'rect',
      width,
      height,
      ...props
    },
    ref
  ) => {
    const variantClasses = {
      text: 'h-4 w-full rounded-radius-sm',
      circle: 'rounded-radius-pill',
      rect: 'rounded-radius-md',
    };

    return (
      <div
        ref={ref}
        role="presentation"
        aria-hidden="true"
        style={{ width, height }}
        className={`
          animate-pulse bg-slate-200 dark:bg-slate-800
          ${variantClasses[variant]}
          ${className}
        `}
        {...props}
      />
    );
  }
);

Skeleton.displayName = 'Skeleton';
