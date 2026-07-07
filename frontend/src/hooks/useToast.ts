import { useContext } from 'react';
import { ToastContext } from '../context/ToastContext';

/**
 * useToast - Hook to trigger visual toast alert notifications across the layout.
 * Requires rendering ToastProvider inside the root app component tree.
 *
 * @example
 * const { toast } = useToast();
 * toast('success', 'Logged in successfully!');
 */
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  const toast = (type: 'success' | 'error' | 'warning' | 'info', message: string, duration?: number) => {
    context.addToast(type, message, duration);
  };

  return {
    toast,
    toasts: context.toasts,
    dismiss: context.removeToast,
  };
}
