import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Sparkles, MapPin, Calendar, Users, IndianRupee } from '../icons';

interface RidePreviewValues {
  pickup_location?: string;
  destination?: string;
  departure_date?: string;
  departure_time?: string;
  available_seats?: number;
  contribution_type?: 'free' | 'paid' | 'co-travel';
  contribution_amount?: number;
}

interface RidePreviewCardProps {
  values: RidePreviewValues;
}

/**
 * RidePreviewCard - High-fidelity read-only card showcasing a real-time summary
 * of the ride offering details as the user populates form values.
 */
export const RidePreviewCard: React.FC<RidePreviewCardProps> = ({ values }) => {
  const {
    pickup_location = 'Not selected',
    destination = 'Not selected',
    departure_date,
    departure_time,
    available_seats = 1,
    contribution_type = 'free',
    contribution_amount = 0,
  } = values;

  // Format dates/times beautifully
  const hasDeparture = departure_date && departure_time;
  const formattedTime = hasDeparture
    ? `${departure_date} at ${departure_time}`
    : 'Not scheduled';

  return (
    <Card className="border border-brand-primary/20 bg-slate-50/50 dark:bg-slate-900/30 overflow-hidden shadow-shadow-small animate-fade-in select-none">
      <CardHeader className="bg-brand-primary/5 py-3 border-b border-neutral-borderLine dark:border-slate-800">
        <CardTitle className="text-tiny font-bold text-brand-primary flex items-center gap-1.5 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          Live Offering Preview
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4 pt-4 text-small">
        {/* Pickup Location */}
        <div className="flex gap-2.5 items-start">
          <MapPin className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-neutral-textSub uppercase tracking-wider">Pickup From</span>
            <p className="font-semibold text-neutral-textMain dark:text-slate-200 line-clamp-2">{pickup_location}</p>
          </div>
        </div>

        {/* Destination Location */}
        <div className="flex gap-2.5 items-start">
          <MapPin className="w-4 h-4 text-brand-success shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-neutral-textSub uppercase tracking-wider">Dropping To</span>
            <p className="font-semibold text-neutral-textMain dark:text-slate-200 line-clamp-2">{destination}</p>
          </div>
        </div>

        {/* Departure Details */}
        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-neutral-borderLine dark:border-slate-800">
          <div className="flex gap-2 items-center text-neutral-textSub">
            <Calendar className="w-4 h-4 text-brand-primary" />
            <div className="space-y-0.5">
              <span className="text-[9px] uppercase font-bold tracking-wider">Departure</span>
              <p className="text-tiny font-semibold text-neutral-textMain dark:text-slate-200 line-clamp-1">{formattedTime}</p>
            </div>
          </div>

          <div className="flex gap-2 items-center text-neutral-textSub">
            <Users className="w-4 h-4 text-brand-primary" />
            <div className="space-y-0.5">
              <span className="text-[9px] uppercase font-bold tracking-wider">Seats</span>
              <p className="text-tiny font-semibold text-neutral-textMain dark:text-slate-200">{available_seats} offering</p>
            </div>
          </div>
        </div>

        {/* Contribution Type & Amount */}
        <div className="flex justify-between items-center p-3 bg-neutral-surface dark:bg-slate-900 border border-neutral-borderLine dark:border-slate-800 rounded-radius-md">
          <div className="space-y-0.5">
            <span className="text-[9px] uppercase font-bold text-neutral-textSub tracking-wider">Contribution</span>
            <p className="font-semibold text-neutral-textMain dark:text-slate-200 capitalize">{contribution_type}</p>
          </div>
          {contribution_type === 'paid' ? (
            <div className="flex items-center text-brand-primary font-bold text-h4">
              <IndianRupee className="w-4 h-4" />
              {contribution_amount}
            </div>
          ) : (
            <Badge variant="success" className="font-bold">Free Pool</Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
export default RidePreviewCard;
