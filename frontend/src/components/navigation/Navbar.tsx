import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../../hooks/useProfile';
import { useNotificationsList } from '../../hooks/useNotifications';
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
    const navigate = useNavigate();
    const { data: profile } = useProfile();
    const { data: notifications } = useNotificationsList();

    const unreadCount = notifications?.filter((n: any) => !n.is_read).length || 0;
    const userName = profile?.full_name || 'Commuter';
    const initials = userName.split(' ').map((n: string) => n[0]).join('').substring(0, 2);

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
          <div className="flex items-center gap-3">
            {/* Notification Bell Icon Trigger */}
            <button
              onClick={() => navigate('/notifications')}
              className="relative p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-neutral-textSub hover:text-neutral-textMain focus:outline-none transition-colors duration-theme-fast cursor-pointer"
              aria-label={`${unreadCount} unread notifications`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-brand-error text-neutral-surface font-bold text-[9px] flex items-center justify-center border border-neutral-surface">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Profile Avatar Block */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/profile')}>
              <Avatar src={profile?.profile_photo || undefined} fallback={initials} size="sm" alt={userName} />
              <div className="hidden lg:block text-left select-none leading-none">
                <p className="text-tiny font-semibold text-neutral-textMain dark:text-slate-200">
                  {userName}
                </p>
                <p className="text-[9px] text-neutral-textSub dark:text-slate-400 mt-0.5">
                  {profile?.college_company || 'Commute Connect Partner'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }
);

Navbar.displayName = 'Navbar';
