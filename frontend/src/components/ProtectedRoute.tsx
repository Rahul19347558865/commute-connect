import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Spinner } from './ui/Spinner';

export interface ProtectedRouteProps {
  children: React.ReactNode;
  /**
   * If true, this route is only accessible to users who have completed their database profile setup.
   * Defaults to true.
   */
  requireProfile?: boolean;
}

/**
 * ProtectedRoute - Component to guard routes requiring valid authenticated sessions.
 * Intercepts session states, displaying loading spinners or routing visitors to sign in/profile setups.
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireProfile = true,
}) => {
  const { user, loading, requiresProfileSetup } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-neutral-bg dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <Spinner size="lg" />
          <p className="text-small text-neutral-textSub dark:text-slate-400">Verifying session...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if user session is absent
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirect to profile setup if database record is absent
  if (requireProfile && requiresProfileSetup) {
    return <Navigate to="/register-profile" replace />;
  }

  return <>{children}</>;
};
export default ProtectedRoute;
