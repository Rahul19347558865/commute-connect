import React, { useEffect, useRef, useId } from 'react';
import { X } from '../icons';
import { Button } from './Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './Card';

/**
 * Props for the Modal component.
 */
export interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Governs modal display visibility */
  isOpen: boolean;
  /** Callback fired when closure triggers (backdrop click, escape press, click X) */
  onClose: () => void;
  /** Header title text */
  title?: string;
  /** Header secondary description text */
  description?: string;
}

/**
 * Modal - Reusable accessible overlay dialog.
 * Features built-in keyboard Escape key listener, backdrop closure, and strict focus-trapping.
 *
 * @example
 * <Modal isOpen={show} onClose={() => setShow(false)} title="Confirm Action">
 *   <div>Do you want to proceed?</div>
 * </Modal>
 */
export const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      className = '',
      isOpen,
      onClose,
      title,
      description,
      children,
      ...props
    },
    ref
  ) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const titleId = useId();
    const descriptionId = useId();

    // Close on escape key
    useEffect(() => {
      if (!isOpen) return;
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    // Focus Trap implementation
    useEffect(() => {
      if (!isOpen) return;
      const modalElement = modalRef.current;
      if (!modalElement) return;

      const previousActive = document.activeElement;

      // Select all standard focusable nodes
      const focusableSelector =
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
      const focusableElements = modalElement.querySelectorAll<HTMLElement>(focusableSelector);

      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key !== 'Tab') return;
        const focusables = Array.from(
          modalElement.querySelectorAll<HTMLElement>(focusableSelector)
        );
        if (focusables.length === 0) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey) {
          // Backward tab
          if (document.activeElement === first) {
            last.focus();
            e.preventDefault();
          }
        } else {
          // Forward tab
          if (document.activeElement === last) {
            first.focus();
            e.preventDefault();
          }
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        if (previousActive instanceof HTMLElement) {
          previousActive.focus();
        }
      };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
      <div
        ref={ref}
        className={`fixed inset-0 z-layer-overlay flex items-center justify-center p-4 xs:p-6 ${className}`}
        {...props}
      >
        {/* Backdrop overlay */}
        <div
          className="absolute inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm transition-opacity duration-theme-normal animate-fade-in"
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Modal Window Container Card */}
        <div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? titleId : undefined}
          aria-describedby={description ? descriptionId : undefined}
          className="w-full max-w-md relative z-layer-modal transform transition-all duration-theme-normal animate-scale-in"
        >
          <Card className="border-none">
            {/* Close Button X */}
            <div className="absolute right-4 top-4 z-10">
              <Button
                variant="ghost"
                size="sm"
                className="w-8 h-8 p-0"
                onClick={onClose}
                aria-label="Close modal dialog"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {(title || description) && (
              <CardHeader className="pr-12">
                {title && <CardTitle id={titleId}>{title}</CardTitle>}
                {description && (
                  <CardDescription id={descriptionId}>{description}</CardDescription>
                )}
              </CardHeader>
            )}

            <CardContent className={title || description ? '' : 'pt-spacing-lg'}>
              {children}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
);

Modal.displayName = 'Modal';
