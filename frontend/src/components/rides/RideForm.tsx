import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Textarea';
import { LocationAutocomplete } from './LocationAutocomplete';
import { ContributionSection } from './ContributionSection';
import { RidePreviewCard } from './RidePreviewCard';

const frontendRideSchema = z
  .object({
    pickup_location: z.string().min(2, 'Pickup address is required'),
    pickup_latitude: z.number({ invalid_type_error: 'Please search and select a valid pickup location.' }),
    pickup_longitude: z.number(),
    destination: z.string().min(2, 'Destination address is required'),
    destination_latitude: z.number({ invalid_type_error: 'Please search and select a valid destination location.' }),
    destination_longitude: z.number(),
    departure_date: z.string().min(1, 'Departure date is required'),
    departure_time: z.string().min(1, 'Departure time is required'),
    available_seats: z.number({ invalid_type_error: 'Seat count must be a number' })
      .int('Must be a whole number')
      .positive('Must offer at least 1 seat'),
    contribution_type: z.enum(['free', 'paid', 'co-travel']),
    contribution_amount: z.number().nonnegative().optional().default(0),
    notes: z.string().nullable().optional(),
  })
  .refine(
    (data) => {
      // Prevent identical pickup and destination
      if (data.pickup_location.trim().toLowerCase() === data.destination.trim().toLowerCase()) {
        return false;
      }
      const latDelta = Math.abs(data.pickup_latitude - data.destination_latitude);
      const lonDelta = Math.abs(data.pickup_longitude - data.destination_longitude);
      if (latDelta < 0.0001 && lonDelta < 0.0001) {
        return false;
      }
      return true;
    },
    {
      message: 'Pickup and destination locations cannot be identical.',
      path: ['destination'],
    }
  )
  .refine(
    (data) => {
      // Must be in the future
      const departDateTime = new Date(`${data.departure_date}T${data.departure_time}`);
      return departDateTime > new Date();
    },
    {
      message: 'Departure time must be scheduled in the future.',
      path: ['departure_time'],
    }
  )
  .refine(
    (data) => {
      if (data.contribution_type === 'paid' && (!data.contribution_amount || data.contribution_amount <= 0)) {
        return false;
      }
      return true;
    },
    {
      message: 'Paid rides require a contribution amount greater than zero.',
      path: ['contribution_amount'],
    }
  );

export type RideFormValues = z.infer<typeof frontendRideSchema>;

interface RideFormProps {
  onSubmit: (data: RideFormValues) => Promise<void>;
  isPending?: boolean;
}

/**
 * RideForm - Composite form wrapper orchestrating autocompletes,
 * conditional contribution amounts, and real-time preview layouts.
 */
export const RideForm: React.FC<RideFormProps> = ({ onSubmit, isPending = false }) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm<RideFormValues>({
    resolver: zodResolver(frontendRideSchema),
    defaultValues: {
      pickup_location: '',
      destination: '',
      available_seats: 1,
      contribution_type: 'free',
      contribution_amount: 0,
      notes: '',
    },
  });

  const watchAll = watch();
  const contributionType = watch('contribution_type');

  // Trigger coordinate error state clears if values are updated
  useEffect(() => {
    register('pickup_latitude');
    register('pickup_longitude');
    register('destination_latitude');
    register('destination_longitude');
  }, [register]);

  const handleSelectPickup = (val: { address: string; lat: number; lon: number }) => {
    setValue('pickup_location', val.address);
    setValue('pickup_latitude', val.lat);
    setValue('pickup_longitude', val.lon);
    trigger('pickup_location');
  };

  const handleSelectDestination = (val: { address: string; lat: number; lon: number }) => {
    setValue('destination_location' as any, val.address); // triggers updates
    setValue('destination', val.address);
    setValue('destination_latitude', val.lat);
    setValue('destination_longitude', val.lon);
    trigger('destination');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Input Form Fields */}
      <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-2 space-y-6">
        <div className="space-y-4">
          <LocationAutocomplete
            label="Pickup Location"
            placeholder="Search pickup address..."
            onSelect={handleSelectPickup}
            error={errors.pickup_location?.message || (errors.pickup_latitude?.message as string)}
            disabled={isPending}
          />

          <LocationAutocomplete
            label="Destination Location"
            placeholder="Search destination address..."
            onSelect={handleSelectDestination}
            error={errors.destination?.message || (errors.destination_latitude?.message as string)}
            disabled={isPending}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Departure Date"
            type="date"
            error={errors.departure_date?.message}
            disabled={isPending}
            {...register('departure_date')}
          />

          <Input
            label="Departure Time"
            type="time"
            error={errors.departure_time?.message}
            disabled={isPending}
            {...register('departure_time')}
          />

          <Input
            label="Available Seats"
            type="number"
            placeholder="e.g. 3"
            error={errors.available_seats?.message}
            disabled={isPending}
            {...register('available_seats', { valueAsNumber: true })}
          />
        </div>

        <ContributionSection
          register={register}
          errors={errors}
          watchContributionType={contributionType}
          disabled={isPending}
        />

        <Textarea
          label="Ride Notes (Optional)"
          placeholder="e.g. Please bring helmets, leaving strictly on time, space for luggage available..."
          error={errors.notes?.message}
          disabled={isPending}
          rows={3}
          {...register('notes')}
        />

        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            variant="primary"
            loading={isPending}
            className="px-8 h-10 font-bold"
          >
            Publish Ride
          </Button>
        </div>
      </form>

      {/* Visual Live Preview Side Panel */}
      <div className="lg:col-span-1">
        <div className="sticky top-20">
          <RidePreviewCard values={watchAll} />
        </div>
      </div>
    </div>
  );
};
export default RideForm;
