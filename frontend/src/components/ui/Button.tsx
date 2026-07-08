import React from 'react';
import { Loader } from '../icons';

/**
 * Props for the generic Button component.
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** The design variant of the button */
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost' | 'link';
  /** The physical size of the button */
  size?: 'sm' | 'md' | 'lg';
  /** Shows a loading spinner and sets aria-busy */
  loading?: boolean;
  /** Icon component to render on the left side of the text */
  leftIcon?: React.ReactNode;
  /** Icon component to render on the right side of the text */
  rightIcon?: React.ReactNode;
  /** Makes the button span the full width of its container */
  fullWidth?: boolean;
  /** Support rendering custom elements using composition */
  asChild?: boolean;
}

/**
 * Button - Reusable generic Button component with support for multiple variants,
 * loading indicators, left/right icons, full width configuration, and keyboard accessibility.
 *
 * @example
 * <Button variant="primary" size="md" onClick={() => alert('Clicked!')}>
 *   Click Me
 * </Button>
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = '',
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      asChild = false,
      children,
      ...props
    },
    ref
  ) => {
    const isButtonDisabled = disabled || loading;

    // Tailwind variant styling classes
    const variantStyles = {
      primary: 'bg-brand-primary text-neutral-surface hover:bg-brand-hover active:bg-brand-hover focus-visible:ring-brand-primary dark:bg-brand-primary dark:hover:bg-brand-hover',
      secondary: 'bg-transparent text-brand-primary border border-brand-primary hover:bg-blue-50 active:bg-blue-100 focus-visible:ring-brand-primary dark:text-blue-400 dark:border-blue-400 dark:hover:bg-slate-900',
      success: 'bg-brand-success text-neutral-surface hover:bg-green-600 active:bg-green-700 focus-visible:ring-brand-success',
      danger: 'bg-brand-error text-neutral-surface hover:bg-red-600 active:bg-red-700 focus-visible:ring-brand-error',
      ghost: 'bg-transparent text-neutral-textMain hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 focus-visible:ring-slate-500',
      link: 'bg-transparent text-brand-primary underline hover:text-brand-hover p-0 h-auto border-none focus-visible:ring-brand-primary',
    };

    // Tailwind size styling classes
    const sizeStyles = {
      sm: 'px-3 py-1.5 text-tiny rounded-radius-sm h-8',
      md: 'px-4 py-2.5 text-small rounded-radius-md h-10',
      lg: 'px-6 py-3 text-body rounded-radius-lg h-12',
    };

    const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors duration-theme-fast outline-none select-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer min-h-[36px] min-w-[36px]';
    const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${variantStyles[variant].includes('p-0') ? '' : sizeStyles[size]} ${fullWidth ? 'w-full' : ''} ${className}`;

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children, {
        ...props,
        disabled: isButtonDisabled,
        'aria-disabled': isButtonDisabled,
        'aria-busy': loading,
        className: `${combinedClassName} ${children.props.className || ''}`,
      } as any);
    }

    return (
      <button
        ref={ref}
        disabled={isButtonDisabled}
        aria-disabled={isButtonDisabled}
        aria-busy={loading}
        className={combinedClassName}
        {...props}
      >
        {loading && <Loader className="w-4 h-4 animate-spin mr-2 shrink-0" aria-hidden="true" />}
        {!loading && leftIcon && <span className="mr-2 inline-flex shrink-0">{leftIcon}</span>}
        {children}
        {!loading && rightIcon && <span className="ml-2 inline-flex shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
