import React from 'react';
import { useDisclosure } from '../../hooks/useDisclosure';
import { Navbar } from '../navigation/Navbar';
import { Sidebar } from '../navigation/Sidebar';
import { BottomNav } from '../navigation/BottomNav';

export interface DashboardLayoutProps {
  children: React.ReactNode;
  /** Active page context */
  activeTab?: string;
  /** Callback when tab selection shifts */
  onTabChange?: (tab: string) => void;
}

/**
 * DashboardLayout - Master layout wrapper for authenticated panels.
 * Composes Navbar header, Sidebar drawers, Bottom Nav links, and main view sections,
 * managing mobile viewports slide overlays dynamically.
 */
export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  activeTab,
  onTabChange,
}) => {
  const { isOpen: isSidebarOpen, onOpen: openSidebar, onClose: closeSidebar } = useDisclosure(false);

  return (
    <div className="min-h-screen flex flex-col bg-neutral-bg dark:bg-slate-950 transition-colors duration-theme-normal">
      {/* Top sticky navbar */}
      <Navbar onMenuToggle={openSidebar} activeTab={activeTab} onTabChange={onTabChange} />

      {/* Main panel body */}
      <div className="flex-1 flex flex-col md:flex-row relative">
        {/* Sidebar Left Rail (slides out on mobile, sticky on desktop) */}
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} activeTab={activeTab} onTabChange={onTabChange} />

        {/* Mobile Sidebar overlay backdrop drawer */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-layer-overlay bg-slate-900/40 backdrop-blur-xs md:hidden transition-opacity duration-theme-normal"
            onClick={closeSidebar}
            aria-hidden="true"
          />
        )}

        {/* Content Panel Area */}
        <main className="flex-1 px-4 py-6 md:p-8 overflow-y-auto pb-24 md:pb-8">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>

      {/* Sticky Bottom Navigation (Mobile Viewports only) */}
      <BottomNav activeTab={activeTab} onTabChange={onTabChange} />
    </div>
  );
};
