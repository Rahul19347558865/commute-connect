import React, { useId } from 'react';

/**
 * Props for the Tooltip component.
 */
export interface TooltipProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'content'> {
  /** The description text or nodes to show inside the tooltip popup bubble */
  content: React.ReactNode;
  /** Positioning offset direction */
  position?: 'top' | 'bottom' | 'left' | 'right';
}

/**
 * Tooltip - Reusable ambient overlay label displaying metadata on hover or focus-within.
 * Uses native CSS hover & focus-within mappings to prevent viewport execution overhead.
 *
 * @example
 * <Tooltip content="Offered seats" position="top">
 *   <span className="cursor-pointer">4 Seats</span>
 * </Tooltip>
 */
export const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  ({ className = '', content, position = 'top', children, ...props }, ref) => {
    const generatedId = useId();
    const tooltipId = `tooltip-${generatedId}`;

    const positionClasses = {
      top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
      bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
      left: 'right-full top-1/2 -translate-y-1/2 mr-2',
      right: 'left-full top-1/2 -translate-y-1/2 ml-2',
    };

    return (
      <div
        ref={ref}
        className={`relative inline-flex group ${className}`}
        aria-describedby={tooltipId}
        {...props}
      >
        {/* Child trigger element */}
        {children}

        {/* Tooltip Popup Bubble */}
        <div
          id={tooltipId}
          role="tooltip"
          className={`
            absolute pointer-events-none opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 group-focus-within:opacity-100 group-focus-within:scale-100 transition-all duration-theme-fast z-layer-tooltip px-2.5 py-1 text-tiny text-neutral-surface bg-slate-950 dark:bg-slate-900 border border-slate-800 dark:border-slate-700 rounded-[4px] shadow-shadow-medium max-w-[200px] w-max select-none
            ${positionClasses[position]}
          `}
        >
          {content}
        </div>
      </div>
    );
  }
);

Tooltip.displayName = 'Tooltip';
