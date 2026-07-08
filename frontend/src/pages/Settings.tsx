import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';
import { supabase } from '../services/supabase';
import { DashboardLayout } from '../components/layouts/DashboardLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { PasswordInput } from '../components/ui/PasswordInput';
import { Switch } from '../components/ui/Switch';
import { Shield, Bell, Eye, Moon, LogOut } from '../components/icons';
import { SEO } from '../components';

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { toast } = useToast();

  // Password Update State
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Preference States
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [profileVisible, setProfileVisible] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(
    document.documentElement.classList.contains('dark')
  );

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      toast('error', 'Please fill in all password fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast('error', 'Passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      toast('error', 'Password must be at least 6 characters long.');
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast('success', 'Password updated successfully!');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      toast('error', err.message || 'Failed to update password.');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const toggleTheme = () => {
    const isDark = !isDarkMode;
    setIsDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    toast('success', `Theme switched to ${isDark ? 'Dark' : 'Light'} Mode.`);
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast('success', 'Logged out successfully.');
      navigate('/login');
    } catch {
      toast('error', 'Failed to log out.');
    }
  };

  return (
    <DashboardLayout activeTab="settings">
      <SEO
        title="Account Settings"
        description="Configure account preferences, update password, adjust notification preferences, and privacy controls on Commute Connect."
      />
      <div className="max-w-4xl mx-auto space-y-8 p-2">
        {/* Title Header */}
        <div className="space-y-1">
          <h1 className="text-h1 font-bold text-neutral-textMain dark:text-slate-100 tracking-tight">
            Settings
          </h1>
          <p className="text-small text-neutral-textSub dark:text-slate-400">
            Manage your account security, notification alerts, and application preferences.
          </p>
        </div>

        {/* Account Details Card */}
        <Card className="border border-neutral-borderLine dark:border-slate-800 bg-neutral-surface dark:bg-slate-900 shadow-shadow-small rounded-radius-md">
          <CardHeader>
            <CardTitle className="text-h3 font-bold text-neutral-textMain dark:text-slate-100">
              Account Overview
            </CardTitle>
            <CardDescription className="text-small text-neutral-textSub dark:text-slate-400">
              Your registration identifiers and credentials.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-small">
              <div>
                <span className="text-[11px] font-bold text-neutral-textSub uppercase tracking-wider block">Email Address</span>
                <p className="font-semibold text-neutral-textMain dark:text-slate-200 mt-0.5">{user?.email || 'N/A'}</p>
              </div>
              <div>
                <span className="text-[11px] font-bold text-neutral-textSub uppercase tracking-wider block">Account ID</span>
                <p className="font-mono text-neutral-textSub dark:text-slate-400 mt-0.5 text-xs truncate">{user?.id || 'N/A'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security & Password Card */}
        <Card className="border border-neutral-borderLine dark:border-slate-800 bg-neutral-surface dark:bg-slate-900 shadow-shadow-small rounded-radius-md">
          <CardHeader>
            <CardTitle className="text-h3 font-bold text-neutral-textMain dark:text-slate-100 flex items-center gap-2">
              <Shield className="w-5 h-5 text-brand-primary" />
              Security Settings
            </CardTitle>
            <CardDescription className="text-small text-neutral-textSub dark:text-slate-400">
              Update your account access password.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md">
              <PasswordInput
                label="New Password"
                placeholder="Minimum 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={isUpdatingPassword}
              />
              <PasswordInput
                label="Confirm New Password"
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isUpdatingPassword}
              />
              <Button
                type="submit"
                variant="primary"
                loading={isUpdatingPassword}
                className="w-full sm:w-auto px-6 h-10 font-bold"
              >
                Update Password
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Notifications & Alerts */}
        {/* Notifications & Alerts */}
        <Card className="border border-neutral-borderLine dark:border-slate-800 bg-neutral-surface dark:bg-slate-900 shadow-shadow-small rounded-radius-md">
          <CardHeader>
            <CardTitle className="text-h3 font-bold text-neutral-textMain dark:text-slate-100 flex items-center gap-2">
              <Bell className="w-5 h-5 text-brand-primary" />
              Notification Channels
            </CardTitle>
            <CardDescription className="text-small text-neutral-textSub dark:text-slate-400">
              Select where you want to receive booking updates and chat alerts.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-2">
            <div className="flex items-center justify-between py-2 border-b border-neutral-borderLine dark:border-slate-850">
              <div className="space-y-0.5">
                <span className="font-semibold text-neutral-textMain dark:text-slate-200 text-small">Email Notifications</span>
                <p className="text-tiny text-neutral-textSub dark:text-slate-400">Receive receipt invoices and travel updates.</p>
              </div>
              <Switch checked={emailNotifications} onChange={(e) => setEmailNotifications(e.target.checked)} />
            </div>

            <div className="flex items-center justify-between py-2">
              <div className="space-y-0.5">
                <span className="font-semibold text-neutral-textMain dark:text-slate-200 text-small">Push Alerts</span>
                <p className="text-tiny text-neutral-textSub dark:text-slate-400">Receive real-time match approvals and messages.</p>
              </div>
              <Switch checked={pushNotifications} onChange={(e) => setPushNotifications(e.target.checked)} />
            </div>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card className="border border-neutral-borderLine dark:border-slate-800 bg-neutral-surface dark:bg-slate-900 shadow-shadow-small rounded-radius-md">
          <CardHeader>
            <CardTitle className="text-h3 font-bold text-neutral-textMain dark:text-slate-100 flex items-center gap-2">
              <Eye className="w-5 h-5 text-brand-primary" />
              Privacy Preferences
            </CardTitle>
            <CardDescription className="text-small text-neutral-textSub dark:text-slate-400">
              Control your public profile visibility.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-2">
            <div className="flex items-center justify-between py-2">
              <div className="space-y-0.5">
                <span className="font-semibold text-neutral-textMain dark:text-slate-200 text-small">Public Search Visibility</span>
                <p className="text-tiny text-neutral-textSub dark:text-slate-400">Allow other organization partners to search and view your profile.</p>
              </div>
              <Switch checked={profileVisible} onChange={(e) => setProfileVisible(e.target.checked)} />
            </div>
          </CardContent>
        </Card>

        {/* Appearance & Themes */}
        <Card className="border border-neutral-borderLine dark:border-slate-800 bg-neutral-surface dark:bg-slate-900 shadow-shadow-small rounded-radius-md">
          <CardHeader>
            <CardTitle className="text-h3 font-bold text-neutral-textMain dark:text-slate-100 flex items-center gap-2">
              <Moon className="w-5 h-5 text-brand-primary" />
              Appearance
            </CardTitle>
            <CardDescription className="text-small text-neutral-textSub dark:text-slate-400">
              Toggle theme color configurations.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-2">
            <div className="flex items-center justify-between py-2">
              <div className="space-y-0.5">
                <span className="font-semibold text-neutral-textMain dark:text-slate-200 text-small">Dark Theme Mode</span>
                <p className="text-tiny text-neutral-textSub dark:text-slate-400">Switch application appearance between Light and Dark interface.</p>
              </div>
              <Switch checked={isDarkMode} onChange={() => toggleTheme()} />
            </div>
          </CardContent>
        </Card>

        {/* Logout Action */}
        <div className="pt-4 flex justify-end">
          <Button
            variant="danger"
            onClick={handleLogout}
            leftIcon={<LogOut className="w-4 h-4" />}
            className="px-6 h-10 font-bold"
          >
            Sign Out of Account
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
