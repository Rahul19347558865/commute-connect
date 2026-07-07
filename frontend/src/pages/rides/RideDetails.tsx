import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRideDetails } from '../../hooks/useRides';
import { DashboardLayout } from '../../components/layouts/DashboardLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { Divider } from '../../components/ui/Divider';
import { Skeleton, ErrorState, Button } from '../../components';
import { MapPin, Calendar, Users, IndianRupee, ArrowRight, Info, CheckCircle, Star } from '../../components/icons';

/**
 * RideDetailsPage - Read-only page presenting full route coordinates,
 * driver profiles description, vehicle specifications, and notes comments.
 */
export const RideDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: ride, isLoading, error, refetch } = useRideDetails(id || '');

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
          message={error?.message || 'Failed to retrieve details. The offering may have been deleted.'}
          onRetry={refetch}
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

  return (
    <DashboardLayout activeTab="find-ride">
      <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
        {/* Navigation Actions */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            Back to Discovery
          </Button>
        </div>

        {/* Compound Card details */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex justify-between items-start gap-4">
              <div>
                <CardTitle className="text-h3 font-bold text-neutral-textMain dark:text-slate-100">
                  Ride Details
                </CardTitle>
                <CardDescription>
                  Review pickup points, schedule times, and driver verification.
                </CardDescription>
              </div>
              
              {/* Contribution Badge */}
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
            {/* Route Map Flow Block */}
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

            {/* Travel Time Schedule */}
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
                  <span className="text-[9px] uppercase font-bold text-neutral-textSub tracking-wider">Available Seating</span>
                  <p className="font-semibold text-neutral-textMain dark:text-slate-200 mt-0.5">
                    {available_seats} seats offering
                  </p>
                </div>
              </div>
            </div>

            <Divider />

            {/* Driver Profile Section */}
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
            {vehicle && (
              <div className="space-y-4 pt-4 border-t border-neutral-borderLine dark:border-slate-800">
                <h3 className="text-small font-bold text-neutral-textMain dark:text-slate-200 select-none uppercase tracking-wide">
                  Vehicle Specs
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                  <div className="p-3.5 rounded bg-slate-50 dark:bg-slate-850/40 border border-neutral-borderLine dark:border-slate-800">
                    <span className="text-[10px] text-neutral-textSub uppercase font-bold">Type</span>
                    <p className="font-bold text-neutral-textMain dark:text-slate-200 capitalize mt-0.5">{vehicle.vehicle_type}</p>
                  </div>
                  <div className="p-3.5 rounded bg-slate-50 dark:bg-slate-850/40 border border-neutral-borderLine dark:border-slate-800">
                    <span className="text-[10px] text-neutral-textSub uppercase font-bold">Model</span>
                    <p className="font-bold text-neutral-textMain dark:text-slate-200 capitalize mt-0.5">{vehicle.company} {vehicle.model}</p>
                  </div>
                  <div className="p-3.5 rounded bg-slate-50 dark:bg-slate-850/40 border border-neutral-borderLine dark:border-slate-800">
                    <span className="text-[10px] text-neutral-textSub uppercase font-bold">Color</span>
                    <p className="font-bold text-neutral-textMain dark:text-slate-200 capitalize mt-0.5">{vehicle.color}</p>
                  </div>
                  <div className="p-3.5 rounded bg-slate-50 dark:bg-slate-850/40 border border-neutral-borderLine dark:border-slate-800">
                    <span className="text-[10px] text-neutral-textSub uppercase font-bold">Registration</span>
                    <p className="font-bold text-neutral-textMain dark:text-slate-200 font-mono mt-0.5">{vehicle.registration_number || 'N/A'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Ride Notes */}
            {notes && (
              <div className="space-y-2 pt-4 border-t border-neutral-borderLine dark:border-slate-800">
                <h3 className="text-small font-bold text-neutral-textMain dark:text-slate-200 select-none uppercase tracking-wide flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-brand-primary" />
                  Commuter Guidelines
                </h3>
                <p className="p-3 rounded bg-blue-50/30 dark:bg-blue-950/10 border border-brand-primary/10 text-neutral-textMain dark:text-slate-300 leading-relaxed">
                  {notes}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};
export default RideDetailsPage;
