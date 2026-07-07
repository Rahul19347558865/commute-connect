import React, { useId } from 'react';

/**
 * Props for the generic Textarea component.
 */
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Text label displayed above the textarea */
  label?: string;
  /** Optional secondary text info displayed below the textarea */
  helperText?: string;
  /** Error message text. When provided, updates styling to error state */
  error?: string;
}

/**
 * Textarea - Reusable generic multiline text area input form control. Includes support
 * for labels, helper text, error highlights, disabled settings, and ARIA properties.
 *
 * @example
 * <Textarea
 *   label="Tell us about yourself"
 *   placeholder="Enter your biography..."
 *   rows={4}
 *   error={bioError}
 * />
 */
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className = '',
      label,
      helperText,
      error,
      disabled = false,
      id,
      rows = 3,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const textareaId = id || generatedId;
    const helperId = `${textareaId}-helper`;
    const errorId = `${textareaId}-error`;
    const hasError = !!error;

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-small font-medium text-neutral-textMain dark:text-slate-200 select-none cursor-pointer"
          >
            {label}
          </label>
        )}

        <textarea
          id={textareaId}
          ref={ref}
          rows={rows}
          disabled={disabled}
          aria-disabled={disabled}
          aria-invalid={hasError}
          aria-describedby={
            hasError ? errorId : helperText ? helperId : undefined
          }
          className={`
            w-full px-3 py-2 text-small rounded-radius-md border bg-neutral-surface dark:bg-slate-900 text-neutral-textMain dark:text-slate-100 placeholder:text-neutral-textSub placeholder:opacity-70 outline-none transition-colors duration-theme-fast resize-y
            ${hasError 
              ? 'border-brand-error focus-visible:ring-1 focus-visible:ring-brand-error focus-visible:border-brand-error' 
              : 'border-neutral-borderLine focus-visible:ring-1 focus-visible:ring-brand-primary focus-visible:border-brand-primary dark:border-slate-800'
            }
            disabled:opacity-50 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:pointer-events-none
            ${className}
          `}
          {...props}
        />

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

Textarea.displayName = 'Textarea';
