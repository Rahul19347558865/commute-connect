import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../../hooks/useProfile';
import { useCreateRide } from '../../hooks/useRides';
import { useToast } from '../../hooks/useToast';
import { DashboardLayout } from '../../components/layouts/DashboardLayout';
import { RideForm, RideFormValues } from '../../components/rides/RideForm';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Skeleton, Unauthorized, Button } from '../../components';

/**
 * CreateRidePage - View enabling drivers to publish commute pools.
 * Performs role checks, inputs coordinate formatting, and issues Query mutations.
 */
export const CreateRidePage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { data: profile, isLoading: isProfileLoading } = useProfile();
  const { mutateAsync: createRide, isPending: isPublishing } = useCreateRide();

  const handleFormSubmit = async (data: RideFormValues) => {
    try {
      const departureTimeISO = new Date(`${data.departure_date}T${data.departure_time}`).toISOString();
      
      await createRide({
        pickup_location: data.pickup_location,
        pickup_latitude: data.pickup_latitude,
        pickup_longitude: data.pickup_longitude,
        destination: data.destination,
        destination_latitude: data.destination_latitude,
        destination_longitude: data.destination_longitude,
        departure_time: departureTimeISO,
        available_seats: data.available_seats,
        contribution_type: data.contribution_type,
        contribution_amount: data.contribution_amount,
        notes: data.notes || null,
      });

      toast('success', 'Ride offering published successfully!');
      navigate('/');
    } catch (err: any) {
      console.error(err);
      toast('error', err.response?.data?.message || err.message || 'Failed to publish ride details.');
    }
  };

  if (isProfileLoading) {
    return (
      <DashboardLayout activeTab="offer-ride">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <Skeleton variant="text" width="220px" height="24px" />
            <Skeleton variant="text" width="340px" />
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
            <Skeleton variant="rect" height="180px" />
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  // Enforce Driver Role Gate Checks
  const isDriver = profile?.role === 'driver' || profile?.role === 'both';
  if (!isDriver) {
    return (
      <DashboardLayout activeTab="offer-ride">
        <Unauthorized
          title="Driver Account Required"
          message="Only users registered under a driver role are permitted to offer rides. Please update your profile preferences."
          action={
            <Button variant="primary" size="sm" onClick={() => navigate('/profile/edit')}>
              Update Profile Role
            </Button>
          }
        />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeTab="offer-ride">
      <Card className="max-w-5xl mx-auto">
        <CardHeader>
          <CardTitle>Offer a Ride</CardTitle>
          <CardDescription>
            Publish your route and schedule to match with daily organizational commuters.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <RideForm onSubmit={handleFormSubmit} isPending={isPublishing} />
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};
export default CreateRidePage;
