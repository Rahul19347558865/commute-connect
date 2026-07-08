import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDashboard, useRideHistory } from '../hooks/useTrust';
import { useProfile } from '../hooks/useProfile';
import { useNotificationsList, useMarkNotificationRead } from '../hooks/useNotifications';
import { useChatConversations } from '../hooks/useChat';
import { DashboardLayout } from '../components/layouts/DashboardLayout';
import { Card, CardContent } from '../components/ui/Card';
import { Button, Skeleton, ErrorState, SEO } from '../components';
import { Badge } from '../components/ui/Badge';
import { 
  MapPin, Calendar, IndianRupee, Navigation, Plus, Search, 
  ClipboardList, Activity, MessageSquare, Bell 
} from '../components/icons';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  
  // Queries
  const { data: profile } = useProfile();
  const { data: dashboard, isLoading: isDashboardLoading, error: dashboardError, refetch } = useDashboard();
  const { data: historyData } = useRideHistory(1, 5);
  const { data: notifications } = useNotificationsList();
  const { data: chats } = useChatConversations();
  const { mutate: markRead } = useMarkNotificationRead();

  const isLoading = isDashboardLoading;

  if (isLoading) {
    return (
      <DashboardLayout activeTab="home">
        <div className="space-y-6 max-w-6xl mx-auto p-2">
          <Skeleton variant="rect" height="140px" className="rounded-radius-lg" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Skeleton variant="rect" height="100px" className="rounded-radius-md" />
            <Skeleton variant="rect" height="100px" className="rounded-radius-md" />
            <Skeleton variant="rect" height="100px" className="rounded-radius-md" />
            <Skeleton variant="rect" height="100px" className="rounded-radius-md" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton variant="rect" height="300px" className="md:col-span-2 rounded-radius-lg" />
            <Skeleton variant="rect" height="300px" className="md:col-span-1 rounded-radius-lg" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (dashboardError || !dashboard) {
    return (
      <DashboardLayout activeTab="home">
        <ErrorState
          title="Dashboard Loading Failed"
          message={dashboardError?.message || 'Error occurred compiling metrics.'}
          onRetry={refetch}
        />
      </DashboardLayout>
    );
  }

  const { stats, upcomingRides, activeTrip } = dashboard;
  const userName = profile?.full_name || 'Commuter';
  const role = profile?.role || 'passenger';
  
  // States
  const hasNoRides = stats.totalRides === 0 && upcomingRides.length === 0 && !activeTrip;
  const hasActiveTrip = !!activeTrip;
  const hasCompletedRides = stats.totalRides > 0;

  // Formatting Departure time
  const formatDeparture = (timeStr: string) => {
    const d = new Date(timeStr);
    return {
      date: d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', weekday: 'short' }),
      time: d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit', hour12: true })
    };
  };

  return (
    <DashboardLayout activeTab="home">
      <SEO
        title="Dashboard"
        description="Commute Connect daily carpooling dashboard. Manage active trips, fuel sharing requests, and historic statistics."
        schema={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Commute Connect",
          "url": "https://commuteconnect.com"
        }}
      />
      <div className="max-w-6xl mx-auto space-y-8 p-2 animate-fade-in">
        
        {/* Welcome message header section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-2">
          <div>
            <h1 className="text-h1 font-bold text-neutral-textMain dark:text-slate-100 tracking-tight">
              Welcome back, {userName}!
            </h1>
            <p className="text-small text-neutral-textSub dark:text-slate-400 mt-1">
              {role === 'driver' && "You are registered as a Driver partner. Offer routes to share fuel costs."}
              {role === 'passenger' && "Find daily carpools matching your routes to save time and travel green."}
              {role === 'both' && "Ready for a seamless carpool commute today?"}
            </p>
          </div>
          
          {/* Quick CTAs in header */}
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => navigate('/rides')}
              leftIcon={<Search className="w-4 h-4" />}
              className="h-10 px-5 font-semibold text-small rounded-radius-md"
            >
              Find Ride
            </Button>
            {(role === 'driver' || role === 'both') && (
              <Button
                variant="primary"
                onClick={() => navigate('/rides/create')}
                leftIcon={<Plus className="w-4 h-4" />}
                className="h-10 px-5 font-semibold text-small rounded-radius-md"
              >
                Offer Ride
              </Button>
            )}
          </div>
        </div>

        {/* ========================================== */}
        {/* STATE 1: ONBOARDING / NO RIDES STATE       */}
        {/* ========================================== */}
        {hasNoRides && (
          <Card className="border border-brand-primary/10 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-950 shadow-shadow-medium rounded-radius-lg overflow-hidden p-8 text-center max-w-3xl mx-auto space-y-6">
            <div className="max-w-xs mx-auto text-brand-primary opacity-90 py-4">
              <svg viewBox="0 0 200 120" className="w-full h-auto" fill="currentColor">
                <path d="M170 85c0-13.8-11.2-25-25-25H55C41.2 60 30 71.2 30 85v10c0 2.8 2.2 5 5 5h10c2.8 0 5-2.2 5-5v-5h100v5c0 2.8 2.2 5 5 5h10c2.8 0 5-2.2 5-5V85zM65 45h70c5.5 0 10-4.5 10-10V25c0-5.5-4.5-10-10-10H65c-5.5 0-10 4.5-10 10v10c0 5.5 4.5 10 10 10z" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="60" cy="85" r="10" />
                <circle cx="140" cy="85" r="10" />
                <path d="M10 110h180" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-h2 font-bold text-neutral-textMain dark:text-slate-100">
                Begin Your First Commute Carpool
              </h2>
              <p className="text-small text-neutral-textSub dark:text-slate-400 max-w-md mx-auto">
                No active pools or historic commutes recorded. Join the network today by searching passenger seats or sharing your vacant vehicle capacity!
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
              <Button
                variant="primary"
                onClick={() => navigate('/rides')}
                className="h-12 px-8 font-bold text-body rounded-radius-md"
              >
                Find Shared Ride Pools
              </Button>
              {(role === 'driver' || role === 'both') ? (
                <Button
                  variant="secondary"
                  onClick={() => navigate('/rides/create')}
                  className="h-12 px-8 font-bold text-body rounded-radius-md"
                >
                  Offer Vacant Seats
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  onClick={() => navigate('/profile')}
                  className="h-12 px-8 font-bold text-body rounded-radius-md"
                >
                  Configure Driver Role
                </Button>
              )}
            </div>
          </Card>
        )}

        {/* ========================================== */}
        {/* STATE 2: ACTIVE TRIP STATE                 */}
        {/* ========================================== */}
        {hasActiveTrip && activeTrip && (
          <Card className="border border-brand-primary/20 bg-brand-primary/[0.02] shadow-shadow-medium rounded-radius-lg overflow-hidden p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-primary/10 pb-4">
              <div className="space-y-1">
                <Badge variant="success" className="font-bold text-tiny uppercase tracking-wider px-2 py-0.5 rounded">
                  Active Commute Pool Running
                </Badge>
                <h3 className="text-h3 font-bold text-neutral-textMain dark:text-slate-100 mt-1">
                  Today's Scheduled Carpool
                </h3>
              </div>
              <Button
                variant="primary"
                onClick={() => navigate(`/rides/${activeTrip.id}/track`)}
                leftIcon={<Navigation className="w-4 h-4 animate-pulse" />}
                className="h-11 px-6 font-bold text-small rounded-radius-md shadow-shadow-small bg-brand-primary hover:bg-brand-hover text-white transition-all hover:scale-[1.02]"
              >
                Track Live Telemetry
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-small">
              {/* Route directions */}
              <div className="space-y-4">
                <div className="flex gap-3">
                  <MapPin className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-bold text-neutral-textSub uppercase tracking-wider block">Pickup point</span>
                    <p className="font-semibold text-neutral-textMain dark:text-slate-200 mt-0.5">{activeTrip.pickup_location}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <MapPin className="w-5 h-5 text-brand-success shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-bold text-neutral-textSub uppercase tracking-wider block">Dropping Destination</span>
                    <p className="font-semibold text-neutral-textMain dark:text-slate-200 mt-0.5">{activeTrip.destination}</p>
                  </div>
                </div>
              </div>

              {/* Scheduled timing parameters */}
              <div className="space-y-4 border-t md:border-t-0 md:border-l border-neutral-borderLine dark:border-slate-800 pt-4 md:pt-0 md:pl-6">
                <div className="flex gap-3">
                  <Calendar className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-bold text-neutral-textSub uppercase tracking-wider block">Departure Timing</span>
                    <p className="font-semibold text-neutral-textMain dark:text-slate-200 mt-0.5">
                      {formatDeparture(activeTrip.departure_time).date} at {formatDeparture(activeTrip.departure_time).time}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Activity className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-bold text-neutral-textSub uppercase tracking-wider block">Seat Allocation Status</span>
                    <p className="font-semibold text-neutral-textMain dark:text-slate-200 mt-0.5">
                      {activeTrip.available_seats} vacant seats pool remaining
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* ========================================== */}
        {/* STATE 3: METRICS & HISTORIES LIST         */}
        {/* ========================================== */}
        {hasCompletedRides && (
          <div className="space-y-6">
            
            {/* Grid metrics blocks */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <Card className="border border-neutral-borderLine dark:border-slate-850 shadow-shadow-small rounded-radius-md hover:border-brand-primary/10 transition-colors">
                <CardContent className="p-5 space-y-1">
                  <span className="text-[10px] text-neutral-textSub font-bold uppercase tracking-wider block">Completed Pools</span>
                  <p className="text-h2 font-extrabold text-neutral-textMain dark:text-slate-100">{stats.totalRides}</p>
                </CardContent>
              </Card>

              <Card className="border border-neutral-borderLine dark:border-slate-850 shadow-shadow-small rounded-radius-md hover:border-brand-primary/10 transition-colors">
                <CardContent className="p-5 space-y-1">
                  <span className="text-[10px] text-neutral-textSub font-bold uppercase tracking-wider block">Commuters Shared</span>
                  <p className="text-h2 font-extrabold text-neutral-textMain dark:text-slate-100">{stats.totalPassengers}</p>
                </CardContent>
              </Card>

              <Card className="border border-neutral-borderLine dark:border-slate-850 shadow-shadow-small rounded-radius-md hover:border-brand-primary/10 transition-colors">
                <CardContent className="p-5 space-y-1">
                  <span className="text-[10px] text-neutral-textSub font-bold uppercase tracking-wider block">Travel Distance</span>
                  <p className="text-h2 font-extrabold text-neutral-textMain dark:text-slate-100">{stats.distanceTravelled} km</p>
                </CardContent>
              </Card>

              <Card className="border border-neutral-borderLine dark:border-slate-850 shadow-shadow-small rounded-radius-md hover:border-brand-primary/10 transition-colors">
                <CardContent className="p-5 space-y-1">
                  <span className="text-[10px] text-neutral-textSub font-bold uppercase tracking-wider block">Balance Contribution</span>
                  <p className="text-h2 font-extrabold text-brand-primary flex items-center">
                    <IndianRupee className="w-5 h-5 shrink-0" />
                    {stats.moneyReceived - stats.moneyContributed >= 0 ? '+' : ''}
                    {stats.moneyReceived - stats.moneyContributed}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Layout content split grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Upcoming Schedules (Left 2 Columns) */}
              <div className="md:col-span-2 space-y-4">
                <h3 className="text-h4 font-bold text-neutral-textMain dark:text-slate-100 select-none">
                  Upcoming Carpool Match Runs
                </h3>

                {upcomingRides.length === 0 ? (
                  <div className="p-6 text-center text-neutral-textSub border border-dashed border-neutral-borderLine dark:border-slate-800 rounded-radius-md bg-neutral-surface dark:bg-slate-900/40">
                    No upcoming match pools scheduled yet. Click Find Ride to discover routes!
                  </div>
                ) : (
                  <div className="space-y-4">
                    {upcomingRides.map((ride: any) => {
                      const departure = formatDeparture(ride.departure_time);
                      return (
                        <Card
                          key={ride.id}
                          onClick={() => navigate(`/rides/${ride.id}`)}
                          className="hover:border-brand-primary/30 border border-neutral-borderLine dark:border-slate-850 cursor-pointer transition-all hover:scale-[1.01] rounded-radius-md"
                        >
                          <CardContent className="p-5 space-y-4">
                            <div className="flex items-center justify-between text-tiny font-semibold text-neutral-textSub">
                              <span className="flex items-center gap-1.5">
                                <Calendar className="w-4 h-4 text-brand-primary" />
                                {departure.date} at {departure.time}
                              </span>
                              <Badge variant="primary" className="font-bold">
                                {ride.available_seats} seats remaining
                              </Badge>
                            </div>

                            <div className="space-y-2 text-small">
                              <div className="flex items-center gap-2 text-neutral-textMain dark:text-slate-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-brand-primary"></span>
                                <span className="font-medium truncate">From: {ride.pickup_location}</span>
                              </div>
                              <div className="flex items-center gap-2 text-neutral-textMain dark:text-slate-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-brand-success"></span>
                                <span className="font-medium truncate">To: {ride.destination}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}

                {/* Historic commute pools tracking */}
                <div className="pt-4 space-y-4">
                  <h3 className="text-h4 font-bold text-neutral-textMain dark:text-slate-100 select-none">
                    Recent Commute History
                  </h3>
                  
                  {!historyData?.history || historyData.history.length === 0 ? (
                    <p className="text-small text-neutral-textSub dark:text-slate-400">No previous commutes logged.</p>
                  ) : (
                    <div className="space-y-3">
                      {historyData.history.map((hist: any) => {
                        const departure = formatDeparture(hist.departure_time);
                        return (
                          <div
                            key={hist.id}
                            className="p-4 rounded-radius-md border border-neutral-borderLine dark:border-slate-850 bg-neutral-surface dark:bg-slate-900/30 flex justify-between items-center text-small gap-4"
                          >
                            <div className="space-y-1 truncate">
                              <p className="font-semibold text-neutral-textMain dark:text-slate-200 truncate">
                                {hist.pickup_location.split(',')[0]} → {hist.destination.split(',')[0]}
                              </p>
                              <span className="text-tiny text-neutral-textSub block">
                                {departure.date}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <Badge variant={hist.status === 'completed' ? 'success' : 'danger'} className="font-semibold">
                                {hist.status}
                              </Badge>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar Feed Widgets (Recent Chats & Activity - 1 Column) */}
              <div className="space-y-6">
                
                {/* Quick actions shortcut box */}
                <div className="space-y-3">
                  <h4 className="text-small font-bold text-neutral-textSub dark:text-slate-400 uppercase tracking-wider select-none">
                    Shortcuts
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    <Button
                      variant="ghost"
                      onClick={() => navigate('/rides')}
                      leftIcon={<Search className="w-4 h-4 text-brand-primary" />}
                      className="w-full justify-start text-left text-small h-12 border border-neutral-borderLine dark:border-slate-800 bg-neutral-surface dark:bg-slate-900 rounded-radius-md hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      Find Shared Pools
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => navigate('/bookings')}
                      leftIcon={<ClipboardList className="w-4 h-4 text-brand-primary" />}
                      className="w-full justify-start text-left text-small h-12 border border-neutral-borderLine dark:border-slate-800 bg-neutral-surface dark:bg-slate-900 rounded-radius-md hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      My Carpool Bookings
                    </Button>
                  </div>
                </div>

                {/* Notifications Panel */}
                <div className="space-y-3">
                  <h4 className="text-small font-bold text-neutral-textSub dark:text-slate-400 uppercase tracking-wider select-none flex items-center gap-1.5">
                    <Bell className="w-4 h-4 text-brand-primary" />
                    Latest Alerts
                  </h4>
                  
                  {!notifications || notifications.filter(n => !n.is_read).length === 0 ? (
                    <div className="p-4 text-center text-tiny text-neutral-textSub border border-neutral-borderLine dark:border-slate-800 bg-neutral-surface dark:bg-slate-900/30 rounded-radius-md">
                      Zero unread alerts logged.
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {notifications.filter(n => !n.is_read).slice(0, 3).map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => {
                            markRead(notif.id);
                            navigate('/notifications');
                          }}
                          className="p-3 border border-brand-primary/10 bg-brand-primary/[0.01] hover:bg-brand-primary/[0.03] rounded-radius-md cursor-pointer transition-colors text-tiny space-y-1"
                        >
                          <p className="font-semibold text-neutral-textMain dark:text-slate-200">{notif.title}</p>
                          <p className="text-neutral-textSub dark:text-slate-400 line-clamp-1">{notif.message_text}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Recent conversations block */}
                <div className="space-y-3">
                  <h4 className="text-small font-bold text-neutral-textSub dark:text-slate-400 uppercase tracking-wider select-none flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-brand-primary" />
                    Active Group Chats
                  </h4>

                  {!chats || chats.length === 0 ? (
                    <div className="p-4 text-center text-tiny text-neutral-textSub border border-neutral-borderLine dark:border-slate-800 bg-neutral-surface dark:bg-slate-900/30 rounded-radius-md">
                      No active conversations running.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {chats.slice(0, 3).map((chatRoom: any) => (
                        <div
                          key={chatRoom.id}
                          onClick={() => navigate(`/chat/${chatRoom.id}`)}
                          className="p-3 border border-neutral-borderLine dark:border-slate-850 bg-neutral-surface dark:bg-slate-900/30 hover:border-brand-primary/25 cursor-pointer rounded-radius-md transition-all flex items-center justify-between text-tiny"
                        >
                          <div className="truncate pr-2">
                            <p className="font-semibold text-neutral-textMain dark:text-slate-200 truncate">
                              Pool Destination: {chatRoom.destination.split(',')[0]}
                            </p>
                            <span className="text-[10px] text-neutral-textSub">
                              Departure: {formatDeparture(chatRoom.departure_time).time}
                            </span>
                          </div>
                          <span className="text-[10px] font-bold text-brand-primary shrink-0 uppercase tracking-wider">Join chat</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

            </div>

          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
