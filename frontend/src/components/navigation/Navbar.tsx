import React from 'react';
import { Menu } from '../icons';
import { Button } from '../ui/Button';
import { Avatar } from '../ui/Avatar';

export interface NavbarProps extends React.HTMLAttributes<HTMLElement> {
  /** Callback triggered when clicking the hamburger drawer trigger on mobile viewports */
  onMenuToggle?: () => void;
  /** Active page context */
  activeTab?: string;
  /** Callback when tab selection shifts */
  onTabChange?: (tab: string) => void;
}

/**
 * Navbar - Reusable header navigation band.
 * Contains responsive menu triggers, logo branding, and user account avatar buttons.
 */
export const Navbar = React.forwardRef<HTMLElement, NavbarProps>(
  ({ className = '', onMenuToggle, activeTab, onTabChange, ...props }, ref) => {
    const navItems = [
      { id: 'home', label: 'Home' },
      { id: 'routes', label: 'Find Rides' },
      { id: 'offer', label: 'Offer Ride' },
    ];

    return (
      <header
        ref={ref}
        className={`w-full h-16 sticky top-0 z-layer-sticky bg-neutral-surface dark:bg-slate-900 border-b border-neutral-borderLine dark:border-slate-800 px-6 flex items-center justify-between shadow-shadow-small transition-colors duration-theme-normal ${className}`}
        {...props}
      >
        {/* Left Side: Hamburger Trigger & Branding */}
        <div className="flex items-center gap-3">
          {onMenuToggle && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMenuToggle}
              className="md:hidden w-10 h-10 p-0 text-neutral-textMain hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Open sidebar menu drawer"
            >
              <Menu className="w-5 h-5" />
            </Button>
          )}
          
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 rounded-radius-md bg-brand-primary flex items-center justify-center text-neutral-surface font-bold text-md shadow-shadow-small">
              CC
            </div>
            <span className="font-bold text-body text-neutral-textMain dark:text-slate-100 tracking-tight hidden xs:block">
              CommuteConnect
            </span>
          </div>
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5" aria-label="Main Navigation">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <Button
                key={item.id}
                variant={isActive ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => onTabChange?.(item.id)}
                className="px-4 h-9 font-medium"
              >
                {item.label}
              </Button>
            );
          })}
        </nav>

        {/* Right Side: Action CTA & User Avatar */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Avatar fallback="JD" size="sm" alt="John Doe" />
            <div className="hidden lg:block text-left select-none leading-none">
              <p className="text-tiny font-semibold text-neutral-textMain dark:text-slate-200">
                John Doe
              </p>
              <p className="text-[10px] text-neutral-textSub dark:text-slate-400">
                Member since 2026
              </p>
            </div>
          </div>
        </div>
      </header>
    );
  }
);

Navbar.displayName = 'Navbar';
