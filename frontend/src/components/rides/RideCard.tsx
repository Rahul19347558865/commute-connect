import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../ui/Card';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { Divider } from '../ui/Divider';
import { MapPin, Calendar, Users, IndianRupee, Star, CheckCircle } from '../icons';

interface DriverProfile {
  full_name: string;
  profile_photo?: string | null;
  college_company: string;
  vehicle_information?: {
    vehicle_type: string;
    company: string;
    model: string;
    color: string;
  } | null;
}

interface RideRecord {
  id: string;
  driver_id: string;
  pickup_location: string;
  destination: string;
  departure_time: string;
  available_seats: number;
  contribution_type: 'free' | 'paid' | 'co-travel';
  contribution_amount: number;
  status: string;
  driver?: DriverProfile;
}

interface RideCardProps {
  ride: RideRecord;
}

/**
 * RideCard - Reusable component showcasing drivers details, routes, schedules,
 * vehicle descriptions, and contribution costs.
 */
export const RideCard: React.FC<RideCardProps> = ({ ride }) => {
  const {
    id,
    pickup_location,
    destination,
    departure_time,
    available_seats,
    contribution_type,
    contribution_amount,
    driver,
  } = ride;

  const driverName = driver?.full_name || 'Verified Commuter';
  const college = driver?.college_company || 'Commute Connect Partner';
  const vehicle = driver?.vehicle_information;

  // Format departure date/time beautifully
  const dateObj = new Date(departure_time);
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

  const initials = driverName
    ? driverName.split(' ').map(n => n[0]).join('').substring(0, 2)
    : '?';

  return (
    <Card className="hover:border-brand-primary/30 dark:hover:border-slate-800 hover:shadow-shadow-medium transition-all duration-theme-normal">
      <CardContent className="p-5 space-y-4">
        {/* Header: Driver Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar src={driver?.profile_photo || undefined} fallback={initials} size="md" alt={driverName} />
            <div className="space-y-0.5">
              <h3 className="text-small font-bold text-neutral-textMain dark:text-slate-100 flex items-center gap-1.5">
                {driverName}
                <span
                  className="inline-flex items-center text-brand-primary cursor-help"
                  title="Verified driver profile"
                  aria-label="Verified Profile"
                >
                  <CheckCircle className="w-3.5 h-3.5 fill-brand-primary/10" />
                </span>
              </h3>
              <p className="text-[11px] text-neutral-textSub dark:text-slate-400">
                {college}
              </p>
            </div>
          </div>
          
          {/* Mock Driver Rating */}
          <div className="flex items-center gap-1 text-[11px] font-bold text-neutral-textMain dark:text-slate-200 bg-amber-50 dark:bg-amber-950/20 px-2 py-0.5 rounded border border-amber-200/30">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            4.8
          </div>
        </div>

        <Divider />

        {/* Route Details */}
        <div className="space-y-2 text-small">
          <div className="flex gap-2 items-start">
            <MapPin className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />
            <p className="font-medium text-neutral-textMain dark:text-slate-200 line-clamp-1" title={pickup_location}>
              {pickup_location}
            </p>
          </div>
          <div className="flex gap-2 items-start">
            <MapPin className="w-4 h-4 text-brand-success shrink-0 mt-0.5" />
            <p className="font-medium text-neutral-textMain dark:text-slate-200 line-clamp-1" title={destination}>
              {destination}
            </p>
          </div>
        </div>

        {/* Vehicle Description */}
        {vehicle && (
          <div className="text-[12px] px-3 py-1.5 rounded bg-slate-50 dark:bg-slate-800/40 border border-neutral-borderLine dark:border-slate-800 text-neutral-textSub dark:text-slate-400 font-medium">
            Vehicle: <span className="text-neutral-textMain dark:text-slate-200 capitalize">{vehicle.color} {vehicle.company} {vehicle.model}</span>
          </div>
        )}

        <Divider />

        {/* Footer: Date, Seats, Contribution, View Details */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-tiny text-neutral-textSub">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5" title="Departure Time">
              <Calendar className="w-4 h-4 text-brand-primary" />
              <span>{formattedDate}, {formattedTime}</span>
            </div>
            <div className="flex items-center gap-1.5" title="Available Seats">
              <Users className="w-4 h-4 text-brand-primary" />
              <span className="font-semibold text-neutral-textMain dark:text-slate-200">{available_seats} seats left</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Contribution Display */}
            {contribution_type === 'free' ? (
              <Badge variant="success" className="font-bold">Free</Badge>
            ) : contribution_type === 'co-travel' ? (
              <Badge variant="default" className="font-bold">Co-Travel</Badge>
            ) : (
              <div className="flex items-center text-brand-primary font-bold text-small">
                <IndianRupee className="w-3.5 h-3.5" />
                {contribution_amount}
              </div>
            )}

            <Link to={`/rides/${id}`}>
              <span className="text-small font-bold text-brand-primary hover:underline hover:text-blue-700 outline-none focus-visible:ring-1 focus-visible:ring-brand-primary rounded p-0.5">
                View Details
              </span>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
export default RideCard;
