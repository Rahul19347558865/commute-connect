import React, { useState } from 'react';
import { useRideHistory } from '../../hooks/useTrust';
import { useAuth } from '../../context/AuthContext';
import { DashboardLayout } from '../../components/layouts/DashboardLayout';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Divider } from '../../components/ui/Divider';
import { Skeleton, EmptyState, ErrorState, Button } from '../../components';
import { ReviewModal } from '../../components/trust/ReviewModal';
import { MapPin, Calendar, IndianRupee, Star, Users } from '../../components/icons';

/**
 * RideHistoryPage - User Completed/Cancelled pools list with pagination and reviews options.
 */
export const RideHistoryPage: React.FC = () => {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const limit = 5;

  const { data, isLoading, error, refetch } = useRideHistory(page, limit);

  // Review states
  const [activeReview, setActiveReview] = useState<{ rideId: string; revieweeId: string; revieweeName: string } | null>(null);

  const history = data?.history || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / limit);

  return (
    <DashboardLayout activeTab="bookings">
      <div className="space-y-6 max-w-3xl mx-auto animate-fade-in text-small">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-h2 font-bold text-neutral-textMain dark:text-slate-100">
              Commute History
            </h1>
            <p className="text-small text-neutral-textSub dark:text-slate-400">
              View details of your historical shared pool rides and submit passenger/driver ratings feedback.
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            <Skeleton variant="rect" height="120px" />
            <Skeleton variant="rect" height="120px" />
          </div>
        ) : error ? (
          <ErrorState
            title="Failed to Load History"
            message={error.message || 'Error occurred compiling history list.'}
            onRetry={refetch}
          />
        ) : history.length === 0 ? (
          <EmptyState
            title="No Commutes Found"
            description="You don't have any completed or cancelled rides in your logs. Active pools will appear here once finalized!"
          />
        ) : (
          <div className="space-y-4">
            {history.map((ride: any) => {
              const isDriver = ride.driver_id === user?.id;
              const driverName = ride.driver?.full_name || 'Commuter';
              
              const dateObj = new Date(ride.departure_time);
              const dateStr = dateObj.toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                weekday: 'short',
              });
              const timeStr = dateObj.toLocaleTimeString(undefined, {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
              });

              // Determine reviewee targets
              const revieweeId = isDriver ? 'passenger-id-placeholder' : ride.driver_id;
              const revieweeName = isDriver ? 'Passenger' : driverName;

              return (
                <Card key={ride.id} className="border border-neutral-borderLine dark:border-slate-850">
                  <CardContent className="p-5 space-y-4">
                    {/* Header */}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-neutral-textMain dark:text-slate-100">
                          {isDriver ? 'Drove Ride Pool' : `Passenger with ${driverName}`}
                        </span>
                        
                        {isDriver && (
                          <Badge variant="default" className="text-[10px] py-0.5">Driver</Badge>
                        )}
                      </div>

                      <Badge
                        variant={ride.status === 'completed' ? 'success' : 'danger'}
                        className="capitalize font-bold"
                      >
                        {ride.status}
                      </Badge>
                    </div>

                    <Divider />

                    {/* Route */}
                    <div className="space-y-2">
                      <div className="flex gap-2 items-start">
                        <MapPin className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />
                        <p className="font-medium text-neutral-textMain dark:text-slate-200 line-clamp-1">{ride.pickup_location}</p>
                      </div>
                      <div className="flex gap-2 items-start">
                        <MapPin className="w-4 h-4 text-brand-success shrink-0 mt-0.5" />
                        <p className="font-medium text-neutral-textMain dark:text-slate-200 line-clamp-1">{ride.destination}</p>
                      </div>
                    </div>

                    <Divider />

                    {/* Footer */}
                    <div className="flex flex-wrap items-center justify-between gap-3 text-tiny text-neutral-textSub">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-brand-primary" />
                          {dateStr}, {timeStr}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-brand-primary" />
                          {ride.available_seats} seats limit
                        </span>
                      </div>

                      <div className="flex items-center gap-4">
                        {ride.contribution_type === 'free' ? (
                          <Badge variant="success" className="font-bold">Free</Badge>
                        ) : (
                          <div className="flex items-center text-brand-primary font-bold text-small">
                            <IndianRupee className="w-3.5 h-3.5" />
                            {ride.contribution_amount}
                          </div>
                        )}

                        {ride.status === 'completed' && !isDriver && (
                          <Button
                            variant="secondary"
                            size="sm"
                            leftIcon={<Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />}
                            onClick={() => setActiveReview({ rideId: ride.id, revieweeId, revieweeName })}
                            className="h-8 text-tiny"
                          >
                            Review Driver
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-3 pt-4">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <span className="text-tiny font-bold text-neutral-textSub">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={page === totalPages}
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Review Modal portal overlay */}
        {activeReview && (
          <ReviewModal
            rideId={activeReview.rideId}
            revieweeId={activeReview.revieweeId}
            revieweeName={activeReview.revieweeName}
            onClose={() => setActiveReview(null)}
          />
        )}
      </div>
    </DashboardLayout>
  );
};
export default RideHistoryPage;
