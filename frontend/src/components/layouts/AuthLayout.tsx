import React from 'react';
import { Card, CardContent } from '../ui/Card';

export interface AuthLayoutProps {
  children: React.ReactNode;
  /** Subheading helper text descriptive label */
  subtitle?: string;
}

/**
 * AuthLayout - Master layout wrapper for authentication screens (login, signup, password resets).
 * Embeds styling bounds, premium background accents, and responsive alignment grids.
 */
export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, subtitle = 'Join your local commuting network' }) => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 xs:p-6 bg-neutral-bg dark:bg-slate-950 transition-colors duration-theme-normal relative overflow-hidden">
      {/* Decorative gradient glowing backdrops */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-radius-pill bg-brand-primary/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-radius-pill bg-blue-500/10 blur-[100px] pointer-events-none" />

      {/* Main card center container */}
      <div className="w-full max-w-md z-layer-base flex flex-col gap-6">
        {/* Branding header block */}
        <div className="flex flex-col items-center text-center gap-2 select-none">
          <div className="w-12 h-12 rounded-radius-md bg-brand-primary flex items-center justify-center text-neutral-surface font-bold text-xl shadow-shadow-medium">
            CC
          </div>
          <h2 className="text-h3 font-bold text-neutral-textMain dark:text-slate-100 mt-2">
            Commute Connect
          </h2>
          <p className="text-small text-neutral-textSub dark:text-slate-400">
            {subtitle}
          </p>
        </div>

        {/* Form Container Card */}
        <Card className="border border-neutral-borderLine dark:border-slate-800 bg-neutral-surface dark:bg-slate-900 shadow-shadow-medium">
          <CardContent className="pt-spacing-lg">
            {children}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
