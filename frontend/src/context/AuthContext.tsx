import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../services/supabase';
import { AuthService, UserProfile } from '../services/authService';

export interface AuthContextProps {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  requiresProfileSetup: boolean;
  login: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<User | null>;
  logout: () => Promise<void>;
  syncProfile: (profileData: Omit<UserProfile, 'id' | 'email'>) => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  updateUserPassword: (password: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps | null>(null);

/**
 * AuthProvider - Wraps application context mapping active session tokens, listening to auth state changes,
 * and syncing user database profiles.
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [requiresProfileSetup, setRequiresProfileSetup] = useState(false);

  const refreshProfile = useCallback(async () => {
    try {
      const dbProfile = await AuthService.getProfile();
      setProfile(dbProfile);
      setRequiresProfileSetup(false);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setProfile(null);
        setRequiresProfileSetup(true);
      } else {
        console.error('Failed to refresh profile:', err.message);
      }
    }
  }, []);

  // Set up Supabase auth listener
  useEffect(() => {
    let isMounted = true;

    async function initializeSession() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session && isMounted) {
          setUser(session.user);
          // Sync database profile
          try {
            const dbProfile = await AuthService.getProfile();
            setProfile(dbProfile);
            setRequiresProfileSetup(false);
          } catch (err: any) {
            if (err.response?.status === 404) {
              setProfile(null);
              setRequiresProfileSetup(true);
            }
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    initializeSession();

    // Subscribe to auth state transitions
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;

      if (event === 'SIGNED_IN' && session) {
        setUser(session.user);
        setLoading(true);
        try {
          const dbProfile = await AuthService.getProfile();
          setProfile(dbProfile);
          setRequiresProfileSetup(false);
        } catch (err: any) {
          if (err.response?.status === 404) {
            setProfile(null);
            setRequiresProfileSetup(true);
          }
        } finally {
          setLoading(false);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);
        setRequiresProfileSetup(false);
        setLoading(false);
      } else if (event === 'TOKEN_REFRESHED' && session) {
        setUser(session.user);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setLoading(false);
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setLoading(false);
      throw error;
    }
    setLoading(false);
    return data.user;
  };

  const logout = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      setLoading(false);
      throw error;
    }
  };

  const syncProfile = async (profileData: Omit<UserProfile, 'id' | 'email'>) => {
    setLoading(true);
    try {
      const dbProfile = await AuthService.registerProfile(profileData);
      setProfile(dbProfile);
      setRequiresProfileSetup(false);
    } finally {
      setLoading(false);
    }
  };

  const sendPasswordReset = async (email: string) => {
    // Suppresses email redirect url mappings in developer settings fallback
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw error;
  };

  const updateUserPassword = async (password: string) => {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw error;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        requiresProfileSetup,
        login,
        signUp,
        logout,
        syncProfile,
        sendPasswordReset,
        updateUserPassword,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * useAuth - Hook to consume Supabase session state contexts.
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
