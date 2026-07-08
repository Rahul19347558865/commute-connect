import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Textarea } from '../ui/Textarea';
import { VehicleSection } from './VehicleSection';

const vehicleSchema = z.object({
  vehicle_type: z.string().min(1, 'Vehicle type is required'),
  company: z.string().min(1, 'Company is required'),
  model: z.string().min(1, 'Model is required'),
  color: z.string().min(1, 'Color is required'),
  registration_number: z.string().min(1, 'Registration number is required'),
  seat_capacity: z.number({ invalid_type_error: 'Seat capacity must be a number' })
    .int('Must be a whole number')
    .positive('Must offer at least 1 seat'),
});

export const profileFormSchema = z
  .object({
    full_name: z.string().min(2, 'Full name is required (min 2 characters)'),
    role: z.enum(['driver', 'passenger', 'both']),
    college_company: z.string().min(2, 'College or company name is required'),
    bio: z.string().nullable().optional(),
    gender: z.string().min(1, 'Gender is required'),
    contact_number: z.string().min(10, 'Contact number must be at least 10 digits'),
    emergency_contact: z.string().min(10, 'Emergency contact must be at least 10 digits'),
    preferred_pickup_area: z.string().min(2, 'Preferred pickup area is required'),
    preferred_drop_area: z.string().min(2, 'Preferred drop area is required'),
    travel_preferences: z.string().nullable().optional(),
    vehicle_information: vehicleSchema.optional(),
  })
  .refine(
    (data) => {
      // If role is driver or both, vehicle_information is required
      if ((data.role === 'driver' || data.role === 'both') && !data.vehicle_information) {
        return false;
      }
      return true;
    },
    {
      message: 'Vehicle information details are mandatory for driver roles.',
      path: ['vehicle_information.vehicle_type'],
    }
  );

export type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface ProfileFormProps {
  initialData: any;
  onSubmit: (data: ProfileFormValues) => Promise<void>;
  isPending?: boolean;
}

/**
 * ProfileForm - Composite profile form component managing inputs validation,
 * conditional vehicle schemas, and submission loaders.
 */
export const ProfileForm: React.FC<ProfileFormProps> = ({
  initialData,
  onSubmit,
  isPending = false,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      full_name: initialData.full_name || '',
      role: initialData.role || 'passenger',
      college_company: initialData.college_company || '',
      bio: initialData.bio || '',
      gender: initialData.gender || '',
      contact_number: initialData.contact_number || '',
      emergency_contact: initialData.emergency_contact || '',
      preferred_pickup_area: initialData.preferred_pickup_area || '',
      preferred_drop_area: initialData.preferred_drop_area || '',
      travel_preferences: initialData.travel_preferences || '',
      vehicle_information: initialData.vehicle_information
        ? {
            vehicle_type: initialData.vehicle_information.vehicle_type || '',
            company: initialData.vehicle_information.company || '',
            model: initialData.vehicle_information.model || '',
            color: initialData.vehicle_information.color || '',
            registration_number: initialData.vehicle_information.registration_number || '',
            seat_capacity: initialData.vehicle_information.seat_capacity || '',
          }
        : undefined,
    },
  });

  const selectedRole = watch('role');
  const showVehicleDetails = selectedRole === 'driver' || selectedRole === 'both';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Section 1: Personal Info */}
      <div className="space-y-4">
        <h2 className="text-small font-bold text-neutral-textMain dark:text-slate-200 select-none uppercase tracking-wide">
          1. Personal Information
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            placeholder="Rahul Sharma"
            error={errors.full_name?.message}
            disabled={isPending}
            {...register('full_name')}
          />
          <Select
            label="Gender"
            error={errors.gender?.message}
            disabled={isPending}
            {...register('gender')}
          >
            <option value="">Select gender...</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="prefer-not">Prefer not to say</option>
          </Select>
          <Input
            label="Contact Number"
            type="tel"
            placeholder="9876543210"
            error={errors.contact_number?.message}
            disabled={isPending}
            {...register('contact_number')}
          />
          <Input
            label="Emergency Contact Number"
            type="tel"
            placeholder="9876543210"
            error={errors.emergency_contact?.message}
            disabled={isPending}
            {...register('emergency_contact')}
          />
        </div>
        <Textarea
          label="Profile Biography"
          placeholder="Write a brief profile description..."
          error={errors.bio?.message}
          disabled={isPending}
          rows={3}
          {...register('bio')}
        />
      </div>

      {/* Section 2: Education / Org */}
      <div className="space-y-4 pt-4 border-t border-neutral-borderLine dark:border-slate-800">
        <h2 className="text-small font-bold text-neutral-textMain dark:text-slate-200 select-none uppercase tracking-wide">
          2. Organization & Role
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="College / Company Name"
            placeholder="IIT Delhi"
            error={errors.college_company?.message}
            disabled={isPending}
            {...register('college_company')}
          />
          <Select
            label="Commuter Role"
            error={errors.role?.message}
            disabled={isPending}
            {...register('role')}
          >
            <option value="passenger">Passenger (Rider)</option>
            <option value="driver">Driver (Owner)</option>
            <option value="both">Both (Offer and Take Pools)</option>
          </Select>
        </div>
      </div>

      {/* Section 3: Commute Prefs */}
      <div className="space-y-4 pt-4 border-t border-neutral-borderLine dark:border-slate-800">
        <h2 className="text-small font-bold text-neutral-textMain dark:text-slate-200 select-none uppercase tracking-wide">
          3. Commute Preferences
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Preferred Pickup Area"
            placeholder="e.g. Connaught Place"
            error={errors.preferred_pickup_area?.message}
            disabled={isPending}
            {...register('preferred_pickup_area')}
          />
          <Input
            label="Preferred Drop-off Area"
            placeholder="e.g. IIT Campus Gate 1"
            error={errors.preferred_drop_area?.message}
            disabled={isPending}
            {...register('preferred_drop_area')}
          />
        </div>
        <Textarea
          label="Travel Preferences (Optional)"
          placeholder="e.g. Silent commute, prefers early departure, no smoking..."
          error={errors.travel_preferences?.message}
          disabled={isPending}
          rows={2}
          {...register('travel_preferences')}
        />
      </div>

      {/* Section 4: Conditionally Render Vehicle Info */}
      {showVehicleDetails && (
        <VehicleSection
          register={register}
          errors={errors}
          disabled={isPending}
        />
      )}

      {/* Form Submission Actions */}
      <div className="flex justify-end gap-3 pt-6 border-t border-neutral-borderLine dark:border-slate-800">
        <Button
          type="submit"
          variant="primary"
          loading={isPending}
          className="px-6 h-10 font-semibold"
        >
          Save Changes
        </Button>
      </div>
    </form>
  );
};
export default ProfileForm;
