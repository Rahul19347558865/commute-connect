import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDisclosure } from '../../hooks/useDisclosure';
import { Navbar } from '../navigation/Navbar';
import { Sidebar } from '../navigation/Sidebar';
import { BottomNav } from '../navigation/BottomNav';
import { Footer } from '../navigation/Footer';

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
  const navigate = useNavigate();
  const { isOpen: isSidebarOpen, onOpen: openSidebar, onClose: closeSidebar } = useDisclosure(false);

  const handleTabChange = (tabId: string) => {
    if (onTabChange) {
      onTabChange(tabId);
      return;
    }

    // Direct routing maps
    switch (tabId) {
      case 'home':
        navigate('/');
        break;
      case 'routes':
        navigate('/rides');
        break;
      case 'offer':
        navigate('/rides/create');
        break;
      case 'bookings':
        navigate('/bookings');
        break;
      case 'messages':
        navigate('/chat');
        break;
      case 'profile':
        navigate('/profile');
        break;
      case 'settings':
        navigate('/settings');
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-bg dark:bg-slate-950 transition-colors duration-theme-normal">
      {/* Top sticky navbar */}
      <Navbar onMenuToggle={openSidebar} activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Main panel body */}
      <div className="flex-1 flex flex-col md:flex-row relative">
        {/* Sidebar Left Rail (slides out on mobile, sticky on desktop) */}
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} activeTab={activeTab} onTabChange={handleTabChange} />

        {/* Mobile Sidebar overlay backdrop drawer */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-layer-overlay bg-slate-900/40 backdrop-blur-xs md:hidden transition-opacity duration-theme-normal"
            onClick={closeSidebar}
            aria-hidden="true"
          />
        )}

        {/* Content Panel Area */}
        <main className="flex-1 px-4 py-6 md:p-8 overflow-y-auto pb-24 md:pb-8 flex flex-col justify-between">
          <div className="max-w-7xl mx-auto w-full flex-1 mb-8">
            {children}
          </div>
          <Footer />
        </main>
      </div>

      {/* Sticky Bottom Navigation (Mobile Viewports only) */}
      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
};
