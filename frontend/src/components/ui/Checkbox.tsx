import React, { useId } from 'react';
import { Check } from '../icons';

/**
 * Props for the generic Checkbox component.
 */
export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Optional text label displayed next to the checkbox */
  label?: string;
  /** Optional secondary text info displayed below the label */
  helperText?: string;
  /** Error state flag. When true, highlights checkbox border */
  error?: boolean;
}

/**
 * Checkbox - Reusable styled checkbox input control.
 * Incorporates a hidden native check element mapped to a custom styled wrapper for A11y.
 *
 * @example
 * <Checkbox
 *   label="I accept the Terms and Conditions"
 *   checked={accepted}
 *   onChange={(e) => setAccepted(e.target.checked)}
 * />
 */
export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      className = '',
      label,
      helperText,
      error = false,
      disabled = false,
      id,
      checked,
      onChange,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const checkboxId = id || generatedId;
    const isChecked = !!checked;

    return (
      <div className={`flex items-start gap-3 select-none group min-h-[44px] py-1 ${className}`}>
        <div className="relative flex items-center justify-center h-5 w-5 shrink-0 mt-0.5">
          <input
            id={checkboxId}
            ref={ref}
            type="checkbox"
            checked={checked}
            disabled={disabled}
            aria-disabled={disabled}
            {...props}
            onChange={disabled ? undefined : onChange}
            className="peer absolute inset-0 opacity-0 w-full h-full cursor-pointer disabled:cursor-not-allowed z-10"
          />
          <div
            className={`
              w-5 h-5 rounded-[4px] border bg-neutral-surface dark:bg-slate-900 flex items-center justify-center transition-all duration-theme-fast
              ${error 
                ? 'border-brand-error' 
                : 'border-neutral-borderLine peer-hover:border-brand-primary dark:border-slate-800 dark:peer-hover:border-blue-400'
              }
              peer-checked:bg-brand-primary peer-checked:border-brand-primary
              peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-brand-primary
              peer-disabled:opacity-50 peer-disabled:bg-slate-100 dark:peer-disabled:bg-slate-800
            `}
          >
            {isChecked && (
              <Check className="w-3.5 h-3.5 text-neutral-surface stroke-[3]" aria-hidden="true" />
            )}
          </div>
        </div>

        {label && (
          <div className="flex flex-col gap-0.5 cursor-pointer">
            <label
              htmlFor={checkboxId}
              className={`
                text-small font-medium text-neutral-textMain dark:text-slate-200 cursor-pointer
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {label}
            </label>
            {helperText && (
              <span className="text-tiny text-neutral-textSub dark:text-slate-400">
                {helperText}
              </span>
            )}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
