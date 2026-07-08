import React, { useId } from 'react';

/**
 * Props for the Radio button component.
 */
export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Text label displayed next to the radio button */
  label?: string;
  /** Optional secondary text info displayed below the label */
  helperText?: string;
}

/**
 * Radio - Reusable styled radio input component.
 * Integrates a hidden native radio input wrapped in custom styling for full accessibility.
 *
 * @example
 * <div className="flex flex-col gap-2">
 *   <Radio name="role" value="driver" label="Driver" checked={role === 'driver'} />
 *   <Radio name="role" value="passenger" label="Passenger" checked={role === 'passenger'} />
 * </div>
 */
export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      className = '',
      label,
      helperText,
      disabled = false,
      id,
      checked,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const radioId = id || generatedId;
    const isChecked = !!checked;

    return (
      <div className={`flex items-start gap-3 select-none group min-h-[44px] py-1 ${className}`}>
        <div className="relative flex items-center justify-center h-5 w-5 shrink-0 mt-0.5">
          <input
            id={radioId}
            ref={ref}
            type="radio"
            checked={checked}
            disabled={disabled}
            aria-disabled={disabled}
            className="peer absolute inset-0 opacity-0 w-full h-full cursor-pointer disabled:cursor-not-allowed z-10"
            {...props}
          />
          <div
            className={`
              w-5 h-5 rounded-radius-pill border bg-neutral-surface dark:bg-slate-900 flex items-center justify-center transition-all duration-theme-fast
              border-neutral-borderLine peer-hover:border-brand-primary dark:border-slate-800 dark:peer-hover:border-blue-400
              peer-checked:border-brand-primary
              peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-brand-primary
              peer-disabled:opacity-50 peer-disabled:bg-slate-100 dark:peer-disabled:bg-slate-800
            `}
          >
            {isChecked && (
              <div className="w-2.5 h-2.5 rounded-radius-pill bg-brand-primary shrink-0" />
            )}
          </div>
        </div>

        {label && (
          <div className="flex flex-col gap-0.5 cursor-pointer">
            <label
              htmlFor={radioId}
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

Radio.displayName = 'Radio';
