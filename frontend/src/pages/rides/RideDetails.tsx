import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  useRideDetails,
  usePassengerBookings,
  useRideRequests,
  useCreateRequest,
  useUpdateRequestStatus,
} from '../../hooks/useRides';
import { useToast } from '../../hooks/useToast';
import { DashboardLayout } from '../../components/layouts/DashboardLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { Divider } from '../../components/ui/Divider';
import { Skeleton, ErrorState, Button, SEO } from '../../components';
import { Modal } from '../../components/ui/Modal';
import { MapPin, Calendar, Users, IndianRupee, ArrowRight, Info, CheckCircle, Star } from '../../components/icons';

/**
 * RideDetailsPage - Displays route schedules, driver metrics, vehicle specs,
 * and handles booking submissions (passengers) or approval actions (drivers).
 */
export const RideDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // Queries
  const { data: ride, isLoading: isRideLoading, error, refetch: refetchRide } = useRideDetails(id || '');
  const { data: bookings, isLoading: isBookingsLoading } = usePassengerBookings();
  
  const isDriver = ride && user && ride.driver_id === user.id;
  const { data: requests, isLoading: isRequestsLoading } = useRideRequests(isDriver ? (ride?.id || '') : '');

  // Mutations
  const { mutateAsync: createRequest, isPending: isRequesting } = useCreateRequest();
  const { mutateAsync: updateRequestStatus, isPending: isUpdating } = useUpdateRequestStatus();

  const handleRequestBooking = async () => {
    if (!ride) return;
    try {
      await createRequest(ride.id);
      toast('success', 'Booking request submitted successfully!');
    } catch (err: any) {
      toast('error', err.response?.data?.message || err.message || 'Failed to submit booking request.');
    }
  };

  const handleUpdateStatus = async (requestId: string, status: 'accepted' | 'rejected' | 'cancelled') => {
    try {
      await updateRequestStatus({ requestId, status });
      toast('success', `Request has been marked as ${status}.`);
    } catch (err: any) {
      toast('error', err.response?.data?.message || err.message || 'Failed to update request status.');
    }
  };

  const isLoading = isRideLoading || isBookingsLoading || (isDriver && isRequestsLoading);

  if (isLoading) {
    return (
      <DashboardLayout activeTab="find-ride">
        <div className="max-w-3xl mx-auto space-y-6">
          <Skeleton variant="rect" height="80px" />
          <Skeleton variant="rect" height="300px" />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !ride) {
    return (
      <DashboardLayout activeTab="find-ride">
        <ErrorState
          title="Ride Offering Not Found"
          message={error?.message || 'Failed to retrieve details.'}
          onRetry={refetchRide}
        />
      </DashboardLayout>
    );
  }

  const {
    pickup_location,
    destination,
    departure_time,
    available_seats,
    contribution_type,
    contribution_amount,
    notes,
    driver,
  } = ride;

  const driverName = driver?.full_name || 'Verified Commuter';
  const college = driver?.college_company || 'Commute Connect Partner';
  const vehicle = driver?.vehicle_information;

  const dateObj = new Date(departure_time);
  const formattedDate = dateObj.toLocaleDateString(undefined, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    weekday: 'long',
  });
  const formattedTime = dateObj.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  const initials = driverName
    ? driverName.split(' ').map((n: string) => n[0]).join('').substring(0, 2)
    : '?';

  // Check passenger request state
  const myRequest = bookings?.find((b: any) => b.ride_id === ride.id && b.status !== 'cancelled');

  return (
    <DashboardLayout activeTab="find-ride">
      <SEO
        title="Ride Details"
        description="View detailed commuter information, vehicle specifications, routes, and book a seat on Commute Connect."
        schema={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://commuteconnect.com/"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Rides",
              "item": "https://commuteconnect.com/rides"
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": "Ride Details",
              "item": `https://commuteconnect.com/rides/${ride?.id || ''}`
            }
          ]
        }}
      />
      <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
        {/* Navigation Action */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            Back
          </Button>
          
          <div className="flex gap-2">
            {(isDriver || myRequest?.status === 'accepted') && (
              <>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate(`/chat/${ride.id}`)}
                  className="font-bold h-9 border border-brand-primary/10 text-brand-primary rounded"
                >
                  Chat Messages
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate(`/rides/${ride.id}/track`)}
                  className="font-bold h-9 rounded"
                >
                  Track Ride Map
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Ride Details Card */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex justify-between items-start gap-4">
              <div>
                <CardTitle className="text-h3 font-bold text-neutral-textMain dark:text-slate-100">
                  Ride Specifications
                </CardTitle>
                <CardDescription>
                  Review schedule times and contribution parameters.
                </CardDescription>
              </div>

              {contribution_type === 'free' ? (
                <Badge variant="success" className="text-small font-bold">Free Ride</Badge>
              ) : contribution_type === 'co-travel' ? (
                <Badge variant="default" className="text-small font-bold">Co-Travel</Badge>
              ) : (
                <div className="flex items-center text-brand-primary font-bold text-h3">
                  <IndianRupee className="w-5 h-5" />
                  {contribution_amount}
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-6 pt-4 text-small">
            {/* Route Locations */}
            <div className="p-4 rounded-radius-md bg-slate-50 dark:bg-slate-800/40 border border-neutral-borderLine dark:border-slate-800 space-y-4">
              <div className="flex gap-3 items-start">
                <MapPin className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-bold text-neutral-textSub uppercase tracking-wider">Pickup Location</span>
                  <p className="font-semibold text-neutral-textMain dark:text-slate-200 mt-0.5">{pickup_location}</p>
                </div>
              </div>

              <div className="pl-2.5">
                <ArrowRight className="w-4 h-4 text-neutral-textSub rotate-90" />
              </div>

              <div className="flex gap-3 items-start">
                <MapPin className="w-5 h-5 text-brand-success shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-bold text-neutral-textSub uppercase tracking-wider">Destination Location</span>
                  <p className="font-semibold text-neutral-textMain dark:text-slate-200 mt-0.5">{destination}</p>
                </div>
              </div>
            </div>

            {/* Time Schedule & Seats Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex gap-3 items-center p-3 bg-neutral-surface dark:bg-slate-900 border border-neutral-borderLine dark:border-slate-800 rounded">
                <Calendar className="w-5 h-5 text-brand-primary" />
                <div>
                  <span className="text-[9px] uppercase font-bold text-neutral-textSub tracking-wider">Date & Time</span>
                  <p className="font-semibold text-neutral-textMain dark:text-slate-200 mt-0.5">
                    {formattedDate} at {formattedTime}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-center p-3 bg-neutral-surface dark:bg-slate-900 border border-neutral-borderLine dark:border-slate-800 rounded">
                <Users className="w-5 h-5 text-brand-primary" />
                <div>
                  <span className="text-[9px] uppercase font-bold text-neutral-textSub tracking-wider">Seating Capacity</span>
                  <p className="font-semibold text-neutral-textMain dark:text-slate-200 mt-0.5">
                    {available_seats} seats offering
                  </p>
                </div>
              </div>
            </div>

            <Divider />

            {/* Driver Profile Summary */}
            <div className="space-y-4">
              <h3 className="text-small font-bold text-neutral-textMain dark:text-slate-200 select-none uppercase tracking-wide">
                Driver Profile
              </h3>

              <div className="flex items-start gap-4">
                <Avatar src={driver?.profile_photo || undefined} fallback={initials} size="lg" alt={driverName} />
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-neutral-textMain dark:text-slate-100 flex items-center gap-1">
                      {driverName}
                      <span className="inline-flex text-brand-primary" title="Verified driver profile">
                        <CheckCircle className="w-3.5 h-3.5 fill-brand-primary/10" />
                      </span>
                    </h4>
                    <div className="flex items-center gap-0.5 text-[11px] font-bold text-neutral-textMain dark:text-slate-200 bg-amber-50 dark:bg-amber-950/20 px-1.5 py-0.2 rounded border border-amber-200/20">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      4.8
                    </div>
                  </div>

                  <p className="text-tiny text-neutral-textSub dark:text-slate-400">
                    {college}
                  </p>

                  <p className="text-neutral-textMain dark:text-slate-300 italic pt-1 leading-relaxed">
                    "{driver?.bio || 'Commutes regularly with Commute Connect.'}"
                  </p>
                </div>
              </div>
            </div>

            {/* Vehicle Details */}
            <div className="space-y-4 pt-4 border-t border-neutral-borderLine dark:border-slate-800">
              <h3 className="text-small font-bold text-neutral-textMain dark:text-slate-200 select-none uppercase tracking-wide">
                Vehicle Specifications
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div className="p-3.5 rounded bg-slate-50 dark:bg-slate-850/40 border border-neutral-borderLine dark:border-slate-800">
                  <span className="text-[10px] text-neutral-textSub uppercase font-bold">Type</span>
                  <p className="font-bold text-neutral-textMain dark:text-slate-200 capitalize mt-0.5">{vehicle?.vehicle_type || 'Not Added'}</p>
                </div>
                <div className="p-3.5 rounded bg-slate-50 dark:bg-slate-850/40 border border-neutral-borderLine dark:border-slate-800">
                  <span className="text-[10px] text-neutral-textSub uppercase font-bold">Model</span>
                  <p className="font-bold text-neutral-textMain dark:text-slate-200 capitalize mt-0.5">
                    {vehicle?.company || vehicle?.model ? `${vehicle?.company || ''} ${vehicle?.model || ''}`.trim() : 'Not Added'}
                  </p>
                </div>
                <div className="p-3.5 rounded bg-slate-50 dark:bg-slate-850/40 border border-neutral-borderLine dark:border-slate-800">
                  <span className="text-[10px] text-neutral-textSub uppercase font-bold">Color</span>
                  <p className="font-bold text-neutral-textMain dark:text-slate-200 capitalize mt-0.5">{vehicle?.color || 'Not Added'}</p>
                </div>
                <div className="p-3.5 rounded bg-slate-50 dark:bg-slate-850/40 border border-neutral-borderLine dark:border-slate-800">
                  <span className="text-[10px] text-neutral-textSub uppercase font-bold">Registration</span>
                  <p className="font-bold text-neutral-textMain dark:text-slate-200 font-mono mt-0.5">{vehicle?.registration_number || 'Not Added'}</p>
                </div>
              </div>
            </div>

            {/* Ride Notes */}
            {notes && (
              <div className="space-y-2 pt-4 border-t border-neutral-borderLine dark:border-slate-800">
                <h3 className="text-small font-bold text-neutral-textMain dark:text-slate-200 select-none uppercase tracking-wide flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-brand-primary" />
                  Driver Guidelines
                </h3>
                <p className="p-3 rounded bg-blue-50/30 dark:bg-blue-950/10 border border-brand-primary/10 text-neutral-textMain dark:text-slate-300 leading-relaxed">
                  {notes}
                </p>
              </div>
            )}

            {/* Passenger Booking Action Button */}
            {!isDriver ? (
              <div className="pt-6 border-t border-neutral-borderLine dark:border-slate-800 flex justify-end">
                {myRequest ? (
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-neutral-textSub font-medium">Request Status:</span>
                      <Badge
                        variant={
                          myRequest.status === 'accepted'
                            ? 'success'
                            : myRequest.status === 'rejected'
                            ? 'danger'
                            : 'warning'
                        }
                        className="capitalize px-3 py-1 font-bold"
                      >
                        {myRequest.status}
                      </Badge>
                    </div>
                    {(myRequest.status === 'pending' || myRequest.status === 'accepted') && (
                      <Button
                        variant="danger"
                        size="sm"
                        loading={isUpdating}
                        onClick={() => handleUpdateStatus(myRequest.id, 'cancelled')}
                      >
                        Cancel Request
                      </Button>
                    )}
                  </div>
                ) : (
                  <Button
                    variant="primary"
                    disabled={available_seats <= 0}
                    loading={isRequesting}
                    onClick={() => setIsConfirmOpen(true)}
                    className="px-8 h-10 font-bold"
                  >
                    {available_seats <= 0 ? 'Fully Booked' : 'Request Ride Booking'}
                  </Button>
                )}
              </div>
            ) : (
              <div className="pt-6 border-t border-neutral-borderLine dark:border-slate-800 flex justify-end">
                <span className="text-small text-neutral-textSub font-semibold italic bg-slate-50 dark:bg-slate-850 px-4 py-2 rounded border border-neutral-borderLine dark:border-slate-850">
                  This is your ride
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Driver Request Management Panel */}
        {isDriver && (
          <Card className="border border-brand-primary/10">
            <CardHeader>
              <CardTitle>Passenger Booking Requests</CardTitle>
              <CardDescription>
                Approve or reject booking requests from matching passengers.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!requests || requests.length === 0 ? (
                <div className="p-6 text-center text-neutral-textSub border border-dashed border-neutral-borderLine dark:border-slate-800 rounded">
                  No booking requests submitted for this ride.
                </div>
              ) : (
                <div className="divide-y divide-neutral-borderLine dark:divide-slate-800">
                  {requests.map((req: any) => {
                    const passengerName = req.passenger?.full_name || 'Passenger';
                    const passInitials = passengerName.split(' ').map((n: string) => n[0]).join('').substring(0, 2);
                    
                    return (
                      <div key={req.id} className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 first:pt-0 last:pb-0">
                        <div className="flex items-center gap-3">
                          <Avatar src={req.passenger?.profile_photo || undefined} fallback={passInitials} size="md" alt={passengerName} />
                          <div>
                            <h4 className="font-bold text-neutral-textMain dark:text-slate-100">
                              {passengerName}
                            </h4>
                            <p className="text-[11px] text-neutral-textSub dark:text-slate-400">
                              {req.passenger?.college_company} • {req.passenger?.gender || 'Not specified'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 self-end sm:self-auto">
                          <Badge
                            variant={
                              req.status === 'accepted'
                                ? 'success'
                                : req.status === 'rejected'
                                ? 'danger'
                                : req.status === 'cancelled'
                                ? 'default'
                                : 'warning'
                            }
                            className="capitalize"
                          >
                            {req.status}
                          </Badge>

                          {req.status === 'pending' && (
                            <div className="flex gap-2">
                              <Button
                                variant="success"
                                size="sm"
                                loading={isUpdating}
                                onClick={() => handleUpdateStatus(req.id, 'accepted')}
                              >
                                Accept
                              </Button>
                              <Button
                                variant="danger"
                                size="sm"
                                loading={isUpdating}
                                onClick={() => handleUpdateStatus(req.id, 'rejected')}
                              >
                                Reject
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        )}
        {/* Booking Confirmation Modal */}
        <Modal
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          title="Confirm Carpool Booking"
          description="Are you sure you want to request a seat booking for this ride pool?"
        >
          <div className="space-y-4 pt-2 text-small">
            <div className="p-3.5 bg-slate-50 dark:bg-slate-850/40 rounded border border-neutral-borderLine dark:border-slate-800 space-y-2">
              <div className="text-neutral-textMain dark:text-slate-200 truncate">
                <span className="font-bold text-neutral-textSub uppercase text-[9px] block">From</span>
                {pickup_location}
              </div>
              <div className="text-neutral-textMain dark:text-slate-200 truncate">
                <span className="font-bold text-neutral-textSub uppercase text-[9px] block">To</span>
                {destination}
              </div>
            </div>
            
            <p className="text-tiny text-neutral-textSub dark:text-slate-400">
              By requesting, the driver will receive your profile details to review. Once accepted, the group chat channel will unlock.
            </p>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="ghost"
                onClick={() => setIsConfirmOpen(false)}
                className="h-10 px-5 rounded text-neutral-textSub"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={async () => {
                  setIsConfirmOpen(false);
                  await handleRequestBooking();
                }}
                loading={isRequesting}
                className="h-10 px-6 rounded font-bold"
              >
                Confirm Request
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  );
};
export default RideDetailsPage;
