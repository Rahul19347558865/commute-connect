import React, { useState } from 'react';
import { usePassengerBookings, useUpdateRequestStatus } from '../../hooks/useRides';
import { useToast } from '../../hooks/useToast';
import { DashboardLayout } from '../../components/layouts/DashboardLayout';
import { Card, CardContent } from '../../components/ui/Card';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { Divider } from '../../components/ui/Divider';
import { Skeleton, EmptyState, ErrorState, Button, SEO } from '../../components';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/Tabs';
import { Calendar, IndianRupee, Users, Navigation, MessageSquare } from '../../components/icons';
import { useNavigate } from 'react-router-dom';

export const BookingsHistoryPage: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { data: bookings, isLoading, error, refetch } = usePassengerBookings();
  const { mutateAsync: updateStatus, isPending: isCancelling } = useUpdateRequestStatus();
  
  const [activeSubTab, setActiveSubTab] = useState('upcoming');

  const handleCancelBooking = async (requestId: string) => {
    try {
      await updateStatus({ requestId, status: 'cancelled' });
      toast('success', 'Booking request cancelled successfully.');
    } catch (err: any) {
      toast('error', err.response?.data?.message || err.message || 'Failed to cancel booking request.');
    }
  };

  const now = new Date();

  // Categorize bookings
  const upcomingBookings = bookings?.filter((b: any) => 
    b.status === 'accepted' && 
    new Date(b.ride?.departure_time) > now && 
    b.ride?.status !== 'completed' && 
    b.ride?.status !== 'cancelled'
  ) || [];

  const pendingBookings = bookings?.filter((b: any) => 
    b.status === 'pending'
  ) || [];

  const completedBookings = bookings?.filter((b: any) => 
    b.ride?.status === 'completed' || 
    (b.status === 'accepted' && new Date(b.ride?.departure_time) <= now)
  ) || [];

  const cancelledBookings = bookings?.filter((b: any) => 
    b.status === 'cancelled' || 
    b.status === 'rejected' || 
    b.ride?.status === 'cancelled'
  ) || [];

  const renderBookingCard = (booking: any) => {
    const ride = booking.ride;
    if (!ride) return null;

    const driverName = ride.driver?.full_name || 'Verified Commuter';
    const college = ride.driver?.college_company || 'Commute Connect Partner';
    const driverInitials = driverName.split(' ').map((n: string) => n[0]).join('').substring(0, 2);

    const dateObj = new Date(ride.departure_time);
    const formattedDate = dateObj.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      weekday: 'short',
    });
    const formattedTime = dateObj.toLocaleTimeString(undefined, {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    return (
      <Card key={booking.id} className="border border-neutral-borderLine dark:border-slate-850 hover:border-brand-primary/20 transition-all rounded-radius-md shadow-shadow-small">
        <CardContent className="p-5 space-y-4">
          
          {/* Header Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar src={ride.driver?.profile_photo || undefined} fallback={driverInitials} size="md" alt={driverName} />
              <div>
                <h4 className="font-bold text-neutral-textMain dark:text-slate-100 text-small">
                  Pool by {driverName}
                </h4>
                <p className="text-[11px] text-neutral-textSub dark:text-slate-400">
                  {college}
                </p>
              </div>
            </div>

            <Badge
              variant={
                booking.status === 'accepted'
                  ? 'success'
                  : booking.status === 'rejected'
                  ? 'danger'
                  : booking.status === 'cancelled'
                  ? 'default'
                  : 'warning'
              }
              className="capitalize font-bold px-2.5 py-0.5 rounded"
            >
              {booking.status}
            </Badge>
          </div>

          <Divider />

          {/* Timeline Route Locations */}
          <div className="space-y-3 relative pl-4 border-l border-neutral-borderLine dark:border-slate-800 ml-2">
            <div className="flex gap-2 items-start relative">
              <span className="absolute -left-[20px] top-1 w-2.5 h-2.5 rounded-full bg-brand-primary"></span>
              <div>
                <span className="text-[9px] font-bold text-neutral-textSub uppercase tracking-wider block">Pickup</span>
                <p className="font-medium text-neutral-textMain dark:text-slate-200 text-small">{ride.pickup_location}</p>
              </div>
            </div>
            <div className="flex gap-2 items-start relative pt-1">
              <span className="absolute -left-[20px] top-2.5 w-2.5 h-2.5 rounded-full bg-brand-success"></span>
              <div>
                <span className="text-[9px] font-bold text-neutral-textSub uppercase tracking-wider block">Destination</span>
                <p className="font-medium text-neutral-textMain dark:text-slate-200 text-small">{ride.destination}</p>
              </div>
            </div>
          </div>

          <Divider />

          {/* Details & Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-tiny text-neutral-textSub">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-brand-primary" />
                <span>{formattedDate}, {formattedTime}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-brand-primary" />
                <span>{ride.available_seats} seats left</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {ride.contribution_type === 'free' ? (
                <Badge variant="success" className="font-bold">Free Pool</Badge>
              ) : (
                <div className="flex items-center text-brand-primary font-bold text-small">
                  <IndianRupee className="w-3.5 h-3.5" />
                  {ride.contribution_amount}
                </div>
              )}

              <div className="flex gap-2">
                {/* Actions available if accepted */}
                {booking.status === 'accepted' && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/chat/${ride.id}`)}
                      leftIcon={<MessageSquare className="w-3.5 h-3.5" />}
                      className="text-brand-primary border border-brand-primary/10 h-8 rounded"
                    >
                      Chat
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => navigate(`/rides/${ride.id}/track`)}
                      leftIcon={<Navigation className="w-3.5 h-3.5" />}
                      className="h-8 rounded"
                    >
                      Track
                    </Button>
                  </>
                )}

                {/* Cancel action */}
                {(booking.status === 'pending' || booking.status === 'accepted') && (
                  <Button
                    variant="danger"
                    size="sm"
                    loading={isCancelling}
                    onClick={() => handleCancelBooking(booking.id)}
                    className="h-8 rounded"
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          </div>

        </CardContent>
      </Card>
    );
  };

  return (
    <DashboardLayout activeTab="bookings">
      <SEO
        title="My Bookings"
        description="Track and manage your daily carpool booking requests, acceptances, and live commute tracking statuses on Commute Connect."
      />
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in p-2">
        <div className="space-y-1">
          <h1 className="text-h1 font-bold text-neutral-textMain dark:text-slate-100 tracking-tight">
            My Bookings
          </h1>
          <p className="text-small text-neutral-textSub dark:text-slate-400">
            Track and manage your ride request approvals and active shared commutes.
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton variant="rect" height="120px" className="rounded-radius-md" />
            <Skeleton variant="rect" height="120px" className="rounded-radius-md" />
          </div>
        ) : error ? (
          <ErrorState
            title="Failed to Load Bookings"
            message={error.message || 'Could not retrieve bookings history.'}
            onRetry={refetch}
          />
        ) : !bookings || bookings.length === 0 ? (
          <EmptyState
            title="No Bookings Found"
            description="You haven't requested any shared rides yet. Search for active pools to submit your first request."
            action={
              <Button variant="primary" size="sm" onClick={() => navigate('/rides')}>
                Find Ride Pools
              </Button>
            }
          />
        ) : (
          <Tabs defaultValue={activeSubTab} onValueChange={setActiveSubTab} className="w-full">
            <TabsList className="flex flex-wrap gap-1 p-1 bg-slate-100 dark:bg-slate-900/60 rounded-radius-sm mb-4">
              <TabsTrigger value="upcoming">Upcoming ({upcomingBookings.length})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({pendingBookings.length})</TabsTrigger>
              <TabsTrigger value="completed">Completed ({completedBookings.length})</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled ({cancelledBookings.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-4">
              {upcomingBookings.length === 0 ? (
                <EmptyState
                  title="No Upcoming Carpools"
                  description="You don't have any accepted bookings scheduled in the future."
                  action={<Button variant="primary" size="sm" onClick={() => navigate('/rides')}>Find Ride Pools</Button>}
                />
              ) : (
                upcomingBookings.map(renderBookingCard)
              )}
            </TabsContent>

            <TabsContent value="pending" className="space-y-4">
              {pendingBookings.length === 0 ? (
                <EmptyState
                  title="No Pending Requests"
                  description="No active requests currently waiting for driver approvals."
                />
              ) : (
                pendingBookings.map(renderBookingCard)
              )}
            </TabsContent>

            <TabsContent value="completed" className="space-y-4">
              {completedBookings.length === 0 ? (
                <EmptyState
                  title="No Completed Trips"
                  description="No historical carpool sessions logged."
                />
              ) : (
                completedBookings.map(renderBookingCard)
              )}
            </TabsContent>

            <TabsContent value="cancelled" className="space-y-4">
              {cancelledBookings.length === 0 ? (
                <EmptyState
                  title="No Cancelled Requests"
                  description="Zero cancelled or rejected match logs recorded."
                />
              ) : (
                cancelledBookings.map(renderBookingCard)
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </DashboardLayout>
  );
};

export default BookingsHistoryPage;
