import React, { useState, useId } from 'react';
import { Eye, EyeOff } from '../icons';

/**
 * Props for the PasswordInput component.
 */
export interface PasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Text label displayed above the input element */
  label?: string;
  /** Optional secondary text info displayed below the input */
  helperText?: string;
  /** Error message text. When provided, updates styling to error state */
  error?: string;
  /** Shows a loading spinner instead of the toggle button */
  loading?: boolean;
}

/**
 * PasswordInput - Accessible password input component with built-in show/hide visibility toggle.
 * Exposes full input props (excluding type) and enforces secure accessibility parameters.
 *
 * @example
 * <PasswordInput
 *   label="Password"
 *   placeholder="Enter your password"
 *   error={passwordError}
 * />
 */
export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
      className = '',
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
    const [showPassword, setShowPassword] = useState(false);
    const generatedId = useId();
    const inputId = id || generatedId;
    const helperId = `${inputId}-helper`;
    const errorId = `${inputId}-error`;

    const hasError = !!error;
    const isInputDisabled = disabled || loading;

    const toggleVisibility = () => {
      if (isInputDisabled) return;
      setShowPassword((prev) => !prev);
    };

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
            type={showPassword ? 'text' : 'password'}
            disabled={isInputDisabled}
            aria-disabled={isInputDisabled}
            aria-invalid={hasError}
            aria-describedby={
              hasError ? errorId : helperText ? helperId : undefined
            }
            className={`
              w-full h-10 pl-3 pr-10 text-small rounded-radius-md border bg-neutral-surface dark:bg-slate-900 text-neutral-textMain dark:text-slate-100 placeholder:text-neutral-textSub placeholder:opacity-70 outline-none transition-colors duration-theme-fast
              ${hasError 
                ? 'border-brand-error focus-visible:ring-1 focus-visible:ring-brand-error focus-visible:border-brand-error' 
                : 'border-neutral-borderLine focus-visible:ring-1 focus-visible:ring-brand-primary focus-visible:border-brand-primary dark:border-slate-800'
              }
              disabled:opacity-50 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:pointer-events-none
              ${className}
            `}
            {...props}
          />

          <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center justify-center">
            {loading ? (
              <span className="w-4 h-4 border-2 border-slate-300 border-t-brand-primary rounded-full animate-spin mr-2" />
            ) : (
              <button
                type="button"
                onClick={toggleVisibility}
                disabled={isInputDisabled}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="w-8 h-8 flex items-center justify-center text-neutral-textSub hover:text-neutral-textMain dark:hover:text-slate-100 rounded-radius-sm outline-none focus-visible:ring-2 focus-visible:ring-brand-primary disabled:opacity-50 transition-colors duration-theme-fast"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" aria-hidden="true" />
                ) : (
                  <Eye className="w-4 h-4" aria-hidden="true" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Error Message */}
        {hasError && (
          <p id={errorId} role="alert" className="text-tiny font-medium text-brand-error animate-fade-in">
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

PasswordInput.displayName = 'PasswordInput';
