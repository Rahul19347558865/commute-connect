import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Divider } from '../ui/Divider';

interface ProfileViewProps {
  profile: any;
}

/**
 * ProfileView - Read-only component rendering organized dashboard card slots
 * for commuter profiles and vehicle specifications details.
 */
export const ProfileView: React.FC<ProfileViewProps> = ({ profile }) => {
  const isDriver = profile.role === 'driver' || profile.role === 'both';
  const vehicle = profile.vehicle_information;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
      {/* Col 1: Identity Card */}
      <Card className="md:col-span-1 h-fit">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-h3 font-bold text-neutral-textMain dark:text-slate-100">
            {profile.full_name}
          </CardTitle>
          <div className="flex justify-center gap-2 mt-1">
            <Badge variant="primary" className="capitalize">{profile.role}</Badge>
            {isDriver && (
              <Badge
                variant={profile.driver_verification_status === 'verified' ? 'success' : 'warning'}
                className="capitalize"
              >
                Driver: {profile.driver_verification_status || 'pending'}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4 text-small">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-neutral-textSub tracking-wider">Bio</span>
            <p className="text-neutral-textMain dark:text-slate-300 italic">
              {profile.bio || 'No biography written.'}
            </p>
          </div>
          <Divider />
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-neutral-textSub font-medium">Organization</span>
              <span className="text-neutral-textMain dark:text-slate-200 font-semibold">{profile.college_company}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-textSub font-medium">Gender</span>
              <span className="text-neutral-textMain dark:text-slate-200 font-semibold capitalize">{profile.gender || 'Not specified'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-textSub font-medium">Contact</span>
              <span className="text-neutral-textMain dark:text-slate-200 font-semibold">{profile.contact_number || 'N/A'}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Col 2 & 3: Details & Vehicle */}
      <div className="md:col-span-2 space-y-6">
        {/* Travel Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Travel Specifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-small">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 border border-neutral-borderLine dark:border-slate-800 rounded-radius-md">
                <span className="text-[10px] uppercase font-bold text-neutral-textSub tracking-wider">Preferred Pickup</span>
                <p className="text-neutral-textMain dark:text-slate-200 font-semibold mt-1">
                  {profile.preferred_pickup_area || 'Not set'}
                </p>
              </div>
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 border border-neutral-borderLine dark:border-slate-800 rounded-radius-md">
                <span className="text-[10px] uppercase font-bold text-neutral-textSub tracking-wider">Preferred Drop</span>
                <p className="text-neutral-textMain dark:text-slate-200 font-semibold mt-1">
                  {profile.preferred_drop_area || 'Not set'}
                </p>
              </div>
            </div>
            <div className="space-y-1 mt-4">
              <span className="text-[10px] uppercase font-bold text-neutral-textSub tracking-wider">Ride Preferences</span>
              <p className="text-neutral-textMain dark:text-slate-300">
                {profile.travel_preferences || 'No preferences listed.'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Vehicle Information */}
        {isDriver && (
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Details</CardTitle>
            </CardHeader>
            <CardContent className="text-small">
              {vehicle ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded border border-neutral-borderLine dark:border-slate-800">
                    <span className="text-[10px] text-neutral-textSub uppercase font-bold">Vehicle Type</span>
                    <p className="font-semibold capitalize text-neutral-textMain dark:text-slate-200 mt-0.5">{vehicle.vehicle_type}</p>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded border border-neutral-borderLine dark:border-slate-800">
                    <span className="text-[10px] text-neutral-textSub uppercase font-bold">Company</span>
                    <p className="font-semibold text-neutral-textMain dark:text-slate-200 mt-0.5">{vehicle.company}</p>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded border border-neutral-borderLine dark:border-slate-800">
                    <span className="text-[10px] text-neutral-textSub uppercase font-bold">Model</span>
                    <p className="font-semibold text-neutral-textMain dark:text-slate-200 mt-0.5">{vehicle.model}</p>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded border border-neutral-borderLine dark:border-slate-800">
                    <span className="text-[10px] text-neutral-textSub uppercase font-bold">Color</span>
                    <p className="font-semibold text-neutral-textMain dark:text-slate-200 mt-0.5">{vehicle.color}</p>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded border border-neutral-borderLine dark:border-slate-800">
                    <span className="text-[10px] text-neutral-textSub uppercase font-bold">Registration</span>
                    <p className="font-semibold text-neutral-textMain dark:text-slate-200 font-mono mt-0.5">{vehicle.registration_number}</p>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded border border-neutral-borderLine dark:border-slate-800">
                    <span className="text-[10px] text-neutral-textSub uppercase font-bold">Seat Capacity</span>
                    <p className="font-semibold text-neutral-textMain dark:text-slate-200 mt-0.5">{vehicle.seat_capacity} offering</p>
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center border border-dashed border-neutral-borderLine dark:border-slate-800 rounded">
                  <p className="text-neutral-textSub">No vehicle details configured yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
export default ProfileView;
