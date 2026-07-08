import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../hooks/useToast';
import { Button, Input, Select, Textarea, AuthLayout } from '../../components';

const profileSchema = z
  .object({
    full_name: z.string().min(2, 'Full name is required (min 2 characters)'),
    role: z.enum(['driver', 'passenger', 'both'], {
      required_error: 'Please select a commuting role',
    }),
    college_company: z.string().min(2, 'College or company name is required'),
    bio: z.string().optional(),
    vehicle_type: z.string().optional(),
    vehicle_number: z.string().optional(),
  })
  .refine(
    (data) => {
      // If role is driver or both, vehicle_type is required
      if ((data.role === 'driver' || data.role === 'both') && !data.vehicle_type) {
        return false;
      }
      return true;
    },
    {
      message: 'Vehicle model type is required for drivers',
      path: ['vehicle_type'],
    }
  );

type ProfileFormValues = z.infer<typeof profileSchema>;

/**
 * RegisterProfile - Onboarding view to collect database profile details
 * (such as full name, commuting role, vehicle type, and organization).
 */
export const RegisterProfile: React.FC = () => {
  const { syncProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: '',
      role: 'passenger',
      college_company: '',
      bio: '',
      vehicle_type: '',
      vehicle_number: '',
    },
  });

  const selectedRole = watch('role');
  const showVehicleDetails = selectedRole === 'driver' || selectedRole === 'both';

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      await syncProfile({
        full_name: data.full_name,
        role: data.role,
        college_company: data.college_company,
        bio: data.bio || undefined,
        vehicle_type: showVehicleDetails ? data.vehicle_type : undefined,
        vehicle_number: showVehicleDetails ? data.vehicle_number : undefined,
      });
      toast('success', 'Profile setup complete! Welcome to Commute Connect.');
      navigate('/', { replace: true });
    } catch (err: any) {
      console.error(err);
      toast('error', err.response?.data?.message || err.message || 'Failed to register profile details.');
    }
  };

  return (
    <AuthLayout subtitle="Set up your commuter profile">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Full Name"
          placeholder="Rahul Sharma"
          error={errors.full_name?.message}
          disabled={isSubmitting}
          {...register('full_name')}
        />

        <Select
          label="Commuting Role"
          error={errors.role?.message}
          disabled={isSubmitting}
          {...register('role')}
        >
          <option value="passenger">Passenger (Rider looking for pools)</option>
          <option value="driver">Driver (Offering pools on routes)</option>
          <option value="both">Both (Offer rides and join others)</option>
        </Select>

        <Input
          label="College / Organization Name"
          placeholder="IIT Delhi or TechCorp Noida"
          error={errors.college_company?.message}
          disabled={isSubmitting}
          {...register('college_company')}
        />

        <Textarea
          label="Bio / Ride Preferences (Optional)"
          placeholder="e.g. Daily commuter. Friendly, silent listener, prefers pop music..."
          error={errors.bio?.message}
          disabled={isSubmitting}
          rows={3}
          {...register('bio')}
        />

        {showVehicleDetails && (
          <div className="p-4 rounded-radius-md bg-slate-50 dark:bg-slate-800 border border-neutral-borderLine dark:border-slate-700 space-y-4 animate-fade-in">
            <h3 className="text-tiny font-bold uppercase tracking-wider text-neutral-textSub dark:text-slate-400">
              Vehicle Information
            </h3>
            
            <Input
              label="Vehicle Model Type"
              placeholder="Honda Activa / Maruti Swift White"
              error={errors.vehicle_type?.message}
              disabled={isSubmitting}
              {...register('vehicle_type')}
            />

            <Input
              label="Vehicle Registration Number (Optional)"
              placeholder="DL-3C-AB-1234"
              error={errors.vehicle_number?.message}
              disabled={isSubmitting}
              {...register('vehicle_number')}
            />
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          className="w-full h-10 mt-2 font-semibold"
          loading={isSubmitting}
        >
          Complete Setup
        </Button>
      </form>
    </AuthLayout>
  );
};
export default RegisterProfile;
