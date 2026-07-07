import React from 'react';
import { ToastProvider } from '../../context/ToastContext';

export interface AppLayoutProps {
  children: React.ReactNode;
}

/**
 * AppLayout - Root shell layout component.
 * Integrates global contextual components (like the ToastProvider notification portal) and general styles.
 */
export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-neutral-bg dark:bg-slate-950 text-neutral-textMain dark:text-slate-100 transition-colors duration-theme-normal flex flex-col font-sans antialiased">
        {children}
      </div>
    </ToastProvider>
  );
};
