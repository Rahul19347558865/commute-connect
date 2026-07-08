import React from 'react';

/**
 * Props for the Divider component.
 */
export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The direction of the separator border line */
  orientation?: 'horizontal' | 'vertical';
  /** Mark as decorative so screen readers ignore it */
  decorative?: boolean;
}

/**
 * Divider - Reusable content separator line.
 * Implements orientation-based styling parameters and accessibility standard separator roles.
 *
 * @example
 * <Divider orientation="horizontal" className="my-4" />
 */
export const Divider = React.forwardRef<HTMLDivElement, DividerProps>(
  (
    {
      className = '',
      orientation = 'horizontal',
      decorative = true,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        role={decorative ? undefined : 'separator'}
        aria-orientation={decorative ? undefined : orientation}
        className={`
          bg-neutral-borderLine dark:bg-slate-800 shrink-0
          ${orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]'}
          ${className}
        `}
        {...props}
      />
    );
  }
);

Divider.displayName = 'Divider';
