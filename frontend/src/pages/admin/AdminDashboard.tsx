import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useAdminStats,
  useAdminUsers,
  useAdminRides,
  useAdminReports,
  useResolveReport,
  useSuspendUser,
  useRestoreUser,
  useArchiveRide,
} from '../../hooks/useAdmin';
import { useToast } from '../../hooks/useToast';
import { DashboardLayout } from '../../components/layouts/DashboardLayout';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/Tabs';
import { Skeleton, ErrorState, Button } from '../../components';
import { Shield, Star, AlertTriangle, CheckCircle, X } from '../../components/icons';

/**
 * AdminDashboardPage - Multi-tabbed administration console for platform moderation.
 */
export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [activeSubTab, setActiveSubTab] = useState('overview');

  // Queries
  const { data: stats, isLoading: isStatsLoading, error: statsError } = useAdminStats();
  const { data: users, isLoading: isUsersLoading } = useAdminUsers();
  const { data: rides, isLoading: isRidesLoading } = useAdminRides();
  const { data: reports, isLoading: isReportsLoading } = useAdminReports();

  // Mutations
  const { mutateAsync: resolveReport } = useResolveReport();
  const { mutateAsync: suspendUser } = useSuspendUser();
  const { mutateAsync: restoreUser } = useRestoreUser();
  const { mutateAsync: archiveRide } = useArchiveRide();

  const handleResolveReport = async (reportId: string, status: 'resolved' | 'dismissed') => {
    try {
      await resolveReport({ reportId, status });
      toast('success', `Report successfully marked as ${status}.`);
    } catch (err: any) {
      toast('error', err.message || 'Failed to update report status.');
    }
  };

  const handleSuspend = async (userId: string) => {
    try {
      await suspendUser(userId);
      toast('success', 'User profile suspended and flag updated.');
    } catch (err: any) {
      toast('error', err.message || 'Failed to suspend user.');
    }
  };

  const handleRestore = async (userId: string) => {
    try {
      await restoreUser(userId);
      toast('success', 'User profile restored successfully.');
    } catch (err: any) {
      toast('error', err.message || 'Failed to restore user.');
    }
  };

  const handleArchiveRide = async (rideId: string) => {
    try {
      await archiveRide(rideId);
      toast('success', 'Ride successfully cancelled and archived.');
    } catch (err: any) {
      toast('error', err.message || 'Failed to archive ride.');
    }
  };

  const isLoading = isStatsLoading || isUsersLoading || isRidesLoading || isReportsLoading;

  if (isLoading) {
    return (
      <DashboardLayout activeTab="profile">
        <div className="max-w-5xl mx-auto space-y-6">
          <Skeleton variant="rect" height="150px" />
          <Skeleton variant="rect" height="350px" />
        </div>
      </DashboardLayout>
    );
  }

  if (statsError) {
    return (
      <DashboardLayout activeTab="profile">
        <ErrorState
          title="Admin Panel Error"
          message={statsError.message || 'Verification of admin role failed.'}
          onRetry={() => navigate('/')}
        />
      </DashboardLayout>
    );
  }

  const pendingReportsCount = (reports || []).filter((r: any) => r.status === 'pending').length;

  return (
    <DashboardLayout activeTab="profile">
      <div className="space-y-6 max-w-5xl mx-auto animate-fade-in text-small">
        {/* Header Title */}
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-brand-primary" />
          <div>
            <h1 className="text-h2 font-bold text-neutral-textMain dark:text-slate-100 select-none">
              Admin Moderation Center
            </h1>
            <p className="text-small text-neutral-textSub dark:text-slate-400">
              Manage users, audit ride listings, and resolve user flags.
            </p>
          </div>
        </div>

        {/* Tab switch control */}
        <Tabs defaultValue={activeSubTab} onValueChange={setActiveSubTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Platform Stats</TabsTrigger>
            <TabsTrigger value="users">User Directory</TabsTrigger>
            <TabsTrigger value="rides">Ride Listings</TabsTrigger>
            <TabsTrigger value="reports">
              Moderation Queue ({pendingReportsCount})
            </TabsTrigger>
          </TabsList>

          {/* 1. OVERVIEW STATISTICS TAB */}
          <TabsContent value="overview">
            {stats && (
              <div className="space-y-6 animate-fade-in">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="border border-neutral-borderLine dark:border-slate-850">
                    <CardContent className="p-4 space-y-1">
                      <span className="text-[10px] text-neutral-textSub font-bold uppercase tracking-wider block">Total Users</span>
                      <p className="text-h2 font-bold text-neutral-textMain dark:text-slate-100">{stats.totalUsers}</p>
                    </CardContent>
                  </Card>

                  <Card className="border border-neutral-borderLine dark:border-slate-850">
                    <CardContent className="p-4 space-y-1">
                      <span className="text-[10px] text-neutral-textSub font-bold uppercase tracking-wider block">Active Commuters</span>
                      <p className="text-h2 font-bold text-neutral-textMain dark:text-slate-100">{stats.activeUsers}</p>
                    </CardContent>
                  </Card>

                  <Card className="border border-neutral-borderLine dark:border-slate-850">
                    <CardContent className="p-4 space-y-1">
                      <span className="text-[10px] text-neutral-textSub font-bold uppercase tracking-wider block">Total Rides</span>
                      <p className="text-h2 font-bold text-neutral-textMain dark:text-slate-100">{stats.totalRides}</p>
                    </CardContent>
                  </Card>

                  <Card className="border border-neutral-borderLine dark:border-slate-850">
                    <CardContent className="p-4 space-y-1">
                      <span className="text-[10px] text-neutral-textSub font-bold uppercase tracking-wider block">Platform Stars Avg</span>
                      <p className="text-h2 font-bold text-amber-500 flex items-center gap-1">
                        <Star className="w-6 h-6 fill-amber-500" />
                        {stats.averageRating}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="p-5 border border-neutral-borderLine dark:border-slate-850 flex flex-col justify-center text-center">
                    <span className="text-neutral-textSub font-bold text-[10px] uppercase block tracking-wider">Active Telemetry Sessions</span>
                    <p className="text-h1 font-bold text-brand-primary mt-2">{stats.activeRides} Active</p>
                  </Card>

                  <Card className="p-5 border border-neutral-borderLine dark:border-slate-850 flex flex-col justify-center text-center">
                    <span className="text-neutral-textSub font-bold text-[10px] uppercase block tracking-wider">Completed Rides Count</span>
                    <p className="text-h1 font-bold text-brand-success mt-2">{stats.completedRides} Done</p>
                  </Card>

                  <Card className="p-5 border border-neutral-borderLine dark:border-slate-850 flex flex-col justify-center text-center">
                    <span className="text-neutral-textSub font-bold text-[10px] uppercase block tracking-wider">Bookings Pending Drivers Approval</span>
                    <p className="text-h1 font-bold text-amber-500 mt-2">{stats.pendingBookings} Holds</p>
                  </Card>
                </div>
              </div>
            )}
          </TabsContent>

          {/* 2. USER DIRECTORY TAB */}
          <TabsContent value="users">
            {users && (
              <Card className="border border-neutral-borderLine dark:border-slate-850 overflow-hidden animate-fade-in">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-900 border-b border-neutral-borderLine dark:border-slate-800 text-[10px] uppercase tracking-wider font-bold text-neutral-textSub">
                        <th className="p-4">Name / Contact</th>
                        <th className="p-4">Role</th>
                        <th className="p-4">Verification Status</th>
                        <th className="p-4 text-right">Moderation Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-borderLine dark:divide-slate-850">
                      {users.map((u: any) => {
                        const isSuspended = u.driver_verification_status === 'rejected';

                        return (
                          <tr key={u.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-900/10">
                            <td className="p-4">
                              <p className="font-bold text-neutral-textMain dark:text-slate-100">{u.full_name}</p>
                              <p className="text-tiny text-neutral-textSub mt-0.5">{u.email}</p>
                            </td>
                            <td className="p-4 capitalize">{u.role}</td>
                            <td className="p-4">
                              <Badge
                                variant={isSuspended ? 'danger' : u.driver_verification_status === 'verified' ? 'success' : 'default'}
                                className="font-semibold"
                              >
                                {isSuspended ? 'Suspended' : u.driver_verification_status || 'verified'}
                              </Badge>
                            </td>
                            <td className="p-4 text-right">
                              {isSuspended ? (
                                <Button variant="success" size="sm" onClick={() => handleRestore(u.id)} className="h-8 py-0">
                                  Restore Account
                                </Button>
                              ) : (
                                <Button variant="danger" size="sm" onClick={() => handleSuspend(u.id)} className="h-8 py-0">
                                  Suspend Account
                                </Button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}
          </TabsContent>

          {/* 3. RIDE LISTINGS TAB */}
          <TabsContent value="rides">
            {rides && (
              <Card className="border border-neutral-borderLine dark:border-slate-850 overflow-hidden animate-fade-in">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-900 border-b border-neutral-borderLine dark:border-slate-800 text-[10px] uppercase tracking-wider font-bold text-neutral-textSub">
                        <th className="p-4">Route Info</th>
                        <th className="p-4">Driver</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Audits</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-borderLine dark:divide-slate-850">
                      {rides.map((r: any) => {
                        const isCancelled = r.status === 'cancelled';

                        return (
                          <tr key={r.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-900/10">
                            <td className="p-4 max-w-xs truncate">
                              <p className="font-bold text-neutral-textMain dark:text-slate-100 truncate">To: {r.destination}</p>
                              <p className="text-tiny text-neutral-textSub mt-0.5 truncate">From: {r.pickup_location}</p>
                            </td>
                            <td className="p-4">{r.driver?.full_name || 'Driver'}</td>
                            <td className="p-4 capitalize">
                              <Badge
                                variant={r.status === 'completed' ? 'success' : isCancelled ? 'danger' : 'warning'}
                                className="font-semibold"
                              >
                                {r.status}
                              </Badge>
                            </td>
                            <td className="p-4 text-right">
                              {!isCancelled && r.status !== 'completed' && (
                                <Button variant="danger" size="sm" onClick={() => handleArchiveRide(r.id)} className="h-8 py-0">
                                  Archive Listing
                                </Button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}
          </TabsContent>

          {/* 4. MODERATION QUEUE TAB */}
          <TabsContent value="reports">
            {reports && (
              <div className="space-y-4 animate-fade-in">
                {reports.length === 0 ? (
                  <div className="p-6 text-center text-neutral-textSub border border-dashed border-neutral-borderLine dark:border-slate-800 rounded bg-neutral-surface dark:bg-slate-900">
                    Excellent! The user reports moderation queue is completely empty.
                  </div>
                ) : (
                  reports.map((rep: any) => {
                    const isPending = rep.status === 'pending';

                    return (
                      <Card key={rep.id} className={`border ${isPending ? 'border-amber-250/30 bg-amber-500/[0.01]' : 'border-neutral-borderLine dark:border-slate-850'}`}>
                        <CardContent className="p-4 space-y-3">
                          <div className="flex justify-between items-start">
                            <div className="space-y-1">
                              <span className="font-bold text-neutral-textMain dark:text-slate-100 flex items-center gap-1.5">
                                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                                Report #{rep.id.substring(0, 8)}
                              </span>
                              <p className="text-[11px] text-neutral-textSub">
                                Reporter: {rep.reporter?.full_name || 'Reporter'} &bull; Reported target ID: {rep.reported_user_id || rep.reported_ride_id || 'Object'}
                              </p>
                            </div>

                            <Badge variant={isPending ? 'warning' : rep.status === 'resolved' ? 'success' : 'default'} className="font-semibold capitalize">
                              {rep.status}
                            </Badge>
                          </div>

                          <p className="p-3 bg-slate-50 dark:bg-slate-900 border border-neutral-borderLine dark:border-slate-850 rounded italic text-neutral-textMain dark:text-slate-350">
                            "{rep.reason}"
                          </p>

                          {isPending && (
                            <div className="flex gap-2 justify-end pt-1">
                              <Button
                                variant="secondary"
                                size="sm"
                                leftIcon={<X className="w-3.5 h-3.5" />}
                                onClick={() => handleResolveReport(rep.id, 'dismissed')}
                                className="h-8 py-0 text-tiny"
                              >
                                Dismiss Report
                              </Button>
                              <Button
                                variant="primary"
                                size="sm"
                                leftIcon={<CheckCircle className="w-3.5 h-3.5" />}
                                onClick={() => handleResolveReport(rep.id, 'resolved')}
                                className="h-8 py-0 text-tiny"
                              >
                                Resolve / Flag Target
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};
export default AdminDashboardPage;
