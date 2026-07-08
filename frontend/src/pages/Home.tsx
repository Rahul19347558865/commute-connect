import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';
import { DashboardLayout } from '../components/layouts/DashboardLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Link } from 'react-router-dom';

/**
 * Home - The authenticated landing Dashboard home view screen.
 */
export const Home: React.FC = () => {
  const { profile, logout } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('home');

  const handleLogout = async () => {
    try {
      await logout();
      toast('success', 'Logged out successfully. See you soon!');
    } catch (err: any) {
      toast('error', err.message || 'Logout failed.');
    }
  };

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      <div className="space-y-6 animate-fade-in">
        {/* Welcome Jumbotron Banner */}
        <div className="p-6 rounded-radius-lg bg-slate-900 text-neutral-surface flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-shadow-medium">
          <div className="space-y-1">
            <h2 className="text-h2 font-bold tracking-tight">
              Hello, {profile?.full_name || 'Commuter'}!
            </h2>
            <p className="text-small text-slate-300">
              Welcome back to your local carpooling dashboard. Safe travels today!
            </p>
          </div>
          <div className="flex gap-2">
            <Link to="/playground">
              <Button variant="secondary" size="sm" className="bg-white/10 hover:bg-white/20 border-none text-white">
                Open Playground
              </Button>
            </Link>
            <Button variant="danger" size="sm" onClick={handleLogout}>
              Sign Out
            </Button>
          </div>
        </div>

        {/* Dashboard Grid Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* User Profile Card */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>My Commuter Profile</CardTitle>
              <CardDescription>Verified account credentials.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-small">
              <div className="flex items-center justify-between">
                <span className="text-neutral-textSub font-medium">Commuting Role</span>
                <Badge variant="primary" className="capitalize">{profile?.role}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-textSub font-medium">Organization</span>
                <span className="text-neutral-textMain dark:text-slate-200 font-semibold">{profile?.college_company}</span>
              </div>
              {profile?.vehicle_type && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-textSub font-medium">Vehicle Model</span>
                    <span className="text-neutral-textMain dark:text-slate-200 font-semibold">{profile.vehicle_type}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-textSub font-medium">Registration</span>
                    <span className="text-neutral-textMain dark:text-slate-200 font-mono font-semibold">{profile.vehicle_number || 'N/A'}</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats Grid */}
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Available Shared Pools</CardDescription>
                <CardTitle className="text-h1 text-brand-primary">12 Active</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-tiny text-neutral-textSub">Scheduled pools on your organizational routes.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>My Bookings Status</CardDescription>
                <CardTitle className="text-h1 text-brand-success">0 Booked</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-tiny text-neutral-textSub">No upcoming trips booked for this week.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
export default Home;
