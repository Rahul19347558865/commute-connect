import React from 'react';
import { Home, Search, Car, Calendar, MessageSquare, User, Settings, LogOut, X } from '../icons';
import { Button } from '../ui/Button';
import { Divider } from '../ui/Divider';
import { useAuth } from '../../context/AuthContext';

export interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Governs slide-out menu visibility on mobile/tablet viewports */
  isOpen: boolean;
  /** Callback to close the mobile menu drawer */
  onClose: () => void;
  /** Active page selection id */
  activeTab?: string;
  /** Callback when sidebar tab selection shifts */
  onTabChange?: (tab: string) => void;
}

/**
 * Sidebar - Vertical navigation panel.
 * Mounts as a persistent left rail on desktop layouts, and a slide-over mobile drawer overlay on small screens.
 */
export const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ className = '', isOpen, onClose, activeTab, onTabChange, ...props }, ref) => {
    const { logout } = useAuth();
    
    const navItems = [
      { id: 'home', label: 'Dashboard', icon: <Home className="w-4 h-4" /> },
      { id: 'routes', label: 'Find Rides', icon: <Search className="w-4 h-4" /> },
      { id: 'offer', label: 'Offer Ride', icon: <Car className="w-4 h-4" /> },
      { id: 'bookings', label: 'My Bookings', icon: <Calendar className="w-4 h-4" /> },
      { id: 'messages', label: 'Messages', icon: <MessageSquare className="w-4 h-4" /> },
      { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
      { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
    ];

    const handleTabClick = (tabId: string) => {
      onTabChange?.(tabId);
      onClose(); // Automatically close mobile drawer
    };

    return (
      <div
        ref={ref}
        className={`fixed inset-y-0 left-0 z-50 md:z-auto flex w-72 flex-col bg-neutral-surface dark:bg-slate-900 border-r border-neutral-borderLine dark:border-slate-800 shadow-shadow-medium transition-transform duration-theme-normal md:sticky md:translate-x-0 md:h-[calc(100vh-4rem)] md:top-16
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          ${className}
        `}
        {...props}
      >
        {/* Mobile Header with Close X */}
        <div className="flex h-16 items-center justify-between px-6 md:hidden shrink-0">
          <span className="font-bold text-neutral-textMain dark:text-slate-100">Main Menu</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="w-8 h-8 p-0"
            aria-label="Close menu drawer"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Sidebar Nav Items List */}
        <nav className="flex-1 space-y-1.5 p-4 overflow-y-auto" aria-label="Sidebar Navigation">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 text-small font-medium rounded-radius-md outline-none transition-colors duration-theme-fast cursor-pointer select-none
                  ${isActive
                    ? 'bg-brand-primary text-neutral-surface shadow-shadow-small'
                    : 'text-neutral-textSub hover:text-neutral-textMain hover:bg-slate-50 dark:hover:bg-slate-800/50 dark:hover:text-slate-200'
                  }
                  focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2
                `}
              >
                <span className="shrink-0">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer Log Out action */}
        <div className="p-4 shrink-0">
          <Divider className="mb-4" />
          <button
            onClick={async () => {
              try {
                await logout();
              } catch (err) {
                console.error('Logout error:', err);
              }
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-small font-medium text-brand-error hover:bg-red-50 dark:hover:bg-red-950/20 rounded-radius-md outline-none transition-colors duration-theme-fast cursor-pointer select-none"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    );
  }
);

Sidebar.displayName = 'Sidebar';
