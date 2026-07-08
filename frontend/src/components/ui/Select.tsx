import React, { useId } from 'react';
import { ChevronDown } from '../icons';

/**
 * Props for the generic Select component.
 */
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  /** Text label displayed above the select element */
  label?: string;
  /** Optional secondary text info displayed below the select */
  helperText?: string;
  /** Error message text. When provided, updates styling to error state */
  error?: string;
}

/**
 * Select - Reusable styled browser-native select control. Browser native dropdowns provide
 * optimal accessibility (A11y) and touchscreen responsiveness on mobile viewports.
 * Uses composition so users can write `<option>` sub-elements.
 *
 * @example
 * <Select label="Vehicle Type" error={vehicleError}>
 *   <option value="">Select a vehicle...</option>
 *   <option value="car">Car</option>
 *   <option value="bike">Motorcycle</option>
 * </Select>
 */
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className = '',
      label,
      helperText,
      error,
      disabled = false,
      id,
      children,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const selectId = id || generatedId;
    const helperId = `${selectId}-helper`;
    const errorId = `${selectId}-error`;
    const hasError = !!error;

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="text-small font-medium text-neutral-textMain dark:text-slate-200 select-none cursor-pointer"
          >
            {label}
          </label>
        )}

        <div className="relative w-full">
          <select
            id={selectId}
            ref={ref}
            disabled={disabled}
            aria-disabled={disabled}
            aria-invalid={hasError}
            aria-describedby={
              hasError ? errorId : helperText ? helperId : undefined
            }
            className={`
              w-full h-10 pl-3 pr-10 text-small rounded-radius-md border bg-neutral-surface dark:bg-slate-900 text-neutral-textMain dark:text-slate-100 placeholder:text-neutral-textSub outline-none transition-colors duration-theme-fast appearance-none cursor-pointer
              ${hasError 
                ? 'border-brand-error focus-visible:ring-1 focus-visible:ring-brand-error focus-visible:border-brand-error' 
                : 'border-neutral-borderLine focus-visible:ring-1 focus-visible:ring-brand-primary focus-visible:border-brand-primary dark:border-slate-800'
              }
              disabled:opacity-50 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:pointer-events-none
              ${className}
            `}
            {...props}
          >
            {children}
          </select>

          {/* Custom dropdown arrow */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none text-neutral-textSub">
            <ChevronDown className="w-4 h-4 shrink-0" aria-hidden="true" />
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

Select.displayName = 'Select';
