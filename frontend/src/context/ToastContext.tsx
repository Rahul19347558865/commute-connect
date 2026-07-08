import React, { createContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertTriangle, Info, AlertCircle } from '../components/icons';
import { Button } from '../components/ui/Button';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

export interface ToastContextProps {
  toasts: ToastItem[];
  addToast: (type: ToastType, message: string, duration?: number) => void;
  removeToast: (id: string) => void;
}

export const ToastContext = createContext<ToastContextProps | null>(null);

/**
 * ToastProvider - Manages list states of active Toast notifications and renders
 * them in a container pinned at bottom for mobile viewports and top-right for desktop screens.
 */
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback(
    (type: ToastType, message: string, duration = 4000) => {
      const id = `${Date.now()}-${Math.random()}`;
      setToasts((prev) => [...prev, { id, type, message, duration }]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}

      {/* Floating Toast Notification Portal Overlay Container */}
      <div
        className="fixed z-layer-toast pointer-events-none flex flex-col gap-2 w-full max-w-sm
          bottom-spacing-lg left-1/2 -translate-x-1/2 px-spacing-lg
          sm:bottom-auto sm:top-spacing-lg sm:right-spacing-lg sm:left-auto sm:translate-x-0"
      >
        {toasts.map((toast) => (
          <ToastCard key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

interface ToastCardProps {
  toast: ToastItem;
  onClose: () => void;
}

const ToastCard: React.FC<ToastCardProps> = ({ toast, onClose }) => {
  const iconClasses = {
    success: <CheckCircle className="w-5 h-5 text-brand-success shrink-0" />,
    error: <AlertTriangle className="w-5 h-5 text-brand-error shrink-0" />,
    warning: <AlertCircle className="w-5 h-5 text-brand-warning shrink-0" />,
    info: <Info className="w-5 h-5 text-brand-primary shrink-0" />,
  };

  const bgClasses = {
    success: 'border-brand-success bg-white dark:bg-slate-900 border-l-4 shadow-shadow-medium',
    error: 'border-brand-error bg-white dark:bg-slate-900 border-l-4 shadow-shadow-medium',
    warning: 'border-brand-warning bg-white dark:bg-slate-900 border-l-4 shadow-shadow-medium',
    info: 'border-brand-primary bg-white dark:bg-slate-900 border-l-4 shadow-shadow-medium',
  };

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`
        pointer-events-auto flex items-center justify-between gap-3 p-4 rounded-radius-md border border-neutral-borderLine dark:border-slate-800 animate-fade-in w-full
        ${bgClasses[toast.type]}
      `}
    >
      <div className="flex items-center gap-3 overflow-hidden">
        {iconClasses[toast.type]}
        <p className="text-small text-neutral-textMain dark:text-slate-200 font-medium truncate">
          {toast.message}
        </p>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={onClose}
        className="w-6 h-6 p-0 hover:bg-slate-100 dark:hover:bg-slate-800 shrink-0"
        aria-label="Dismiss notification alert"
      >
        <X className="w-3.5 h-3.5" />
      </Button>
    </div>
  );
};
