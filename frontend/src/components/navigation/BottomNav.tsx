import React from 'react';
import { Home, Search, Calendar, MessageSquare, User } from '../icons';

export interface BottomNavProps extends React.HTMLAttributes<HTMLElement> {
  /** The current active section identifier */
  activeTab?: string;
  /** Callback fired when a tab is pressed */
  onTabChange?: (tab: string) => void;
}

/**
 * BottomNav - Accessible mobile bottom tab bar navigation.
 * Sticky at the bottom viewport, hiding automatically on larger desktop media queries.
 */
export const BottomNav = React.forwardRef<HTMLElement, BottomNavProps>(
  ({ className = '', activeTab, onTabChange, ...props }, ref) => {
    const navItems = [
      { id: 'home', label: 'Home', icon: <Home className="w-5 h-5" /> },
      { id: 'routes', label: 'Search', icon: <Search className="w-5 h-5" /> },
      { id: 'bookings', label: 'Bookings', icon: <Calendar className="w-5 h-5" /> },
      { id: 'messages', label: 'Messages', icon: <MessageSquare className="w-5 h-5" /> },
      { id: 'profile', label: 'Profile', icon: <User className="w-5 h-5" /> },
    ];

    return (
      <nav
        ref={ref}
        className={`fixed bottom-0 left-0 right-0 z-layer-sticky md:hidden bg-neutral-surface dark:bg-slate-900 border-t border-neutral-borderLine dark:border-slate-800 shadow-shadow-medium flex items-center justify-around h-16 px-4 safe-bottom ${className}`}
        {...props}
      >
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange?.(item.id)}
              aria-label={item.label}
              className={`
                flex flex-col items-center justify-center flex-1 h-full gap-1 outline-none text-tiny font-medium transition-colors duration-theme-fast cursor-pointer select-none
                ${isActive
                  ? 'text-brand-primary'
                  : 'text-neutral-textSub hover:text-neutral-textMain dark:hover:text-slate-200'
                }
              `}
            >
              <div className="shrink-0">{item.icon}</div>
              <span className="text-[10px] scale-95 tracking-wide leading-none">{item.label}</span>
            </button>
          );
        })}
      </nav>
    );
  }
);

BottomNav.displayName = 'BottomNav';
