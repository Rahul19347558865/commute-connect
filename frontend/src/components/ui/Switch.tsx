import React, { useId } from 'react';

/**
 * Props for the Switch component.
 */
export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Optional label text displayed next to the switch */
  label?: string;
  /** Optional secondary info displayed below the label */
  helperText?: string;
}

/**
 * Switch - Accessible toggle switch button component.
 * Behind the scenes it utilizes a standard checkbox input with role="switch" to preserve
 * keyboard A11y and forms validation capability.
 *
 * @example
 * <Switch
 *   label="Enable email notifications"
 *   checked={notificationsEnabled}
 *   onChange={(e) => setNotificationsEnabled(e.target.checked)}
 * />
 */
export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
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
    const switchId = id || generatedId;
    const isChecked = !!checked;

    return (
      <div className={`flex items-center justify-between gap-4 py-2 min-h-[44px] select-none ${className}`}>
        {label && (
          <div className="flex flex-col gap-0.5 cursor-pointer">
            <label
              htmlFor={switchId}
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

        <div className="relative inline-flex items-center cursor-pointer">
          <input
            id={switchId}
            ref={ref}
            type="checkbox"
            role="switch"
            aria-checked={isChecked}
            checked={checked}
            disabled={disabled}
            aria-disabled={disabled}
            className="peer absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
            {...props}
          />
          <div
            className={`
              w-9 h-5 rounded-radius-pill border bg-slate-200 dark:bg-slate-800 transition-colors duration-theme-fast
              peer-checked:bg-brand-primary peer-checked:border-brand-primary
              peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-brand-primary
              peer-disabled:opacity-50
            `}
          >
            <div
              className={`
                w-4 h-4 rounded-radius-pill bg-neutral-surface shadow-small transition-transform duration-theme-fast mt-[1px] ml-[1px]
                ${isChecked ? 'translate-x-4' : 'translate-x-0'}
              `}
            />
          </div>
        </div>
      </div>
    );
  }
);

Switch.displayName = 'Switch';
