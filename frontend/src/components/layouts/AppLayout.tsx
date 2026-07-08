import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from '../../context/ToastContext';

// Instantiate global React Query client with custom staleTimes and retry fallbacks
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes profile cache
      retry: 1, // Fail fast on API network drops
      refetchOnWindowFocus: false, // Prevent query re-triggers on screen toggles
    },
  },
});

export interface AppLayoutProps {
  children: React.ReactNode;
}

/**
 * AppLayout - Root shell layout component.
 * Integrates global contextual components (like React Query and the ToastProvider) and general styles.
 */
export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <div className="min-h-screen bg-neutral-bg dark:bg-slate-950 text-neutral-textMain dark:text-slate-100 transition-colors duration-theme-normal flex flex-col font-sans antialiased">
          {children}
        </div>
      </ToastProvider>
    </QueryClientProvider>
  );
};
