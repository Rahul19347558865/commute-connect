import React, { useId } from 'react';

/**
 * Props for the generic Input component.
 */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Text label displayed above the input element */
  label?: string;
  /** Optional secondary text info displayed below the input */
  helperText?: string;
  /** Error message text. When provided, updates styling to error state */
  error?: string;
  /** Displays a small indicator showing the input is in loading state */
  loading?: boolean;
}

/**
 * Input - Reusable generic text input form control. Includes support for custom labels,
 * helpers, error highlights, and loading indicators, keeping accessibility (ARIA) mapped.
 *
 * @example
 * <Input
 *   label="Email Address"
 *   type="email"
 *   placeholder="you@example.com"
 *   error={emailError}
 * />
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className = '',
      type = 'text',
      label,
      helperText,
      error,
      loading = false,
      disabled = false,
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const helperId = `${inputId}-helper`;
    const errorId = `${inputId}-error`;

    const hasError = !!error;
    const isInputDisabled = disabled || loading;

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-small font-medium text-neutral-textMain dark:text-slate-200 select-none cursor-pointer"
          >
            {label}
          </label>
        )}

        <div className="relative w-full">
          <input
            id={inputId}
            ref={ref}
            type={type}
            disabled={isInputDisabled}
            aria-disabled={isInputDisabled}
            aria-invalid={hasError}
            aria-describedby={
              hasError ? errorId : helperText ? helperId : undefined
            }
            className={`
              w-full h-10 px-3 text-small rounded-radius-md border bg-neutral-surface dark:bg-slate-900 text-neutral-textMain dark:text-slate-100 placeholder:text-neutral-textSub placeholder:opacity-70 outline-none transition-colors duration-theme-fast
              ${hasError 
                ? 'border-brand-error focus-visible:ring-1 focus-visible:ring-brand-error focus-visible:border-brand-error' 
                : 'border-neutral-borderLine focus-visible:ring-1 focus-visible:ring-brand-primary focus-visible:border-brand-primary dark:border-slate-800'
              }
              disabled:opacity-50 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:pointer-events-none
              ${className}
            `}
            {...props}
          />

          {loading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
              <span className="w-4 h-4 border-2 border-slate-300 border-t-brand-primary rounded-full animate-spin" />
            </div>
          )}
        </div>

        {/* Error Message */}
        {hasError && (
          <p
            id={errorId}
            role="alert"
            className="text-tiny font-medium text-brand-error animate-fade-in"
          >
            {error}
          </p>
        )}

        {/* Helper Text */}
        {!hasError && helperText && (
          <p id={helperId} className="text-tiny text-neutral-textSub dark:text-slate-400">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
