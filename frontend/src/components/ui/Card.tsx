import React from 'react';

/**
 * Card - Main container for a card element.
 * Consumes shadow-small and radius-md from the centralized design tokens.
 */
export const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className = '', ...props }, ref) => (
    <div
      ref={ref}
      className={`bg-neutral-surface dark:bg-slate-900 border border-neutral-borderLine dark:border-slate-800 rounded-radius-md shadow-shadow-small transition-all duration-theme-fast overflow-hidden ${className}`}
      {...props}
    />
  )
);
Card.displayName = 'Card';

/**
 * CardHeader - Header container for grouping titles and descriptions.
 */
export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className = '', ...props }, ref) => (
    <div
      ref={ref}
      className={`p-spacing-lg flex flex-col gap-1 ${className}`}
      {...props}
    />
  )
);
CardHeader.displayName = 'CardHeader';

/**
 * CardTitle - Primary text title within a card header.
 */
export const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className = '', ...props }, ref) => (
    <h3
      ref={ref}
      className={`text-h3 font-bold text-neutral-textMain dark:text-slate-100 ${className}`}
      {...props}
    />
  )
);
CardTitle.displayName = 'CardTitle';

/**
 * CardDescription - Secondary descriptive text.
 */
export const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className = '', ...props }, ref) => (
    <p
      ref={ref}
      className={`text-small text-neutral-textSub dark:text-slate-400 ${className}`}
      {...props}
    />
  )
);
CardDescription.displayName = 'CardDescription';

/**
 * CardContent - Body container within a card.
 */
export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className = '', ...props }, ref) => (
    <div
      ref={ref}
      className={`px-spacing-lg pb-spacing-lg ${className}`}
      {...props}
    />
  )
);
CardContent.displayName = 'CardContent';

/**
 * CardFooter - Action panel container at the bottom of a card.
 */
export const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className = '', ...props }, ref) => (
    <div
      ref={ref}
      className={`px-spacing-lg pb-spacing-lg flex items-center justify-end gap-3 ${className}`}
      {...props}
    />
  )
);
CardFooter.displayName = 'CardFooter';
