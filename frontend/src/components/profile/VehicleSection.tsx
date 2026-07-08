import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';

interface VehicleSectionProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  disabled?: boolean;
}

/**
 * VehicleSection - Sub-form rendering inputs for vehicle details (type, model, color, capacity).
 * Required for drivers and both commuters, optional for passengers.
 */
export const VehicleSection: React.FC<VehicleSectionProps> = ({
  register,
  errors,
  disabled = false,
}) => {
  const vehicleErrors = errors.vehicle_information as any;

  return (
    <div className="space-y-4 p-4 rounded-radius-md bg-slate-50 dark:bg-slate-800/40 border border-neutral-borderLine dark:border-slate-800 animate-fade-in">
      <h3 className="text-tiny font-bold uppercase tracking-wider text-neutral-textSub dark:text-slate-400 select-none">
        Vehicle Information (Drivers & Share Pools)
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Vehicle Type"
          error={vehicleErrors?.vehicle_type?.message}
          disabled={disabled}
          {...register('vehicle_information.vehicle_type')}
        >
          <option value="">Select vehicle type...</option>
          <option value="car">Car (4-wheeler)</option>
          <option value="bike">Bike (2-wheeler)</option>
          <option value="scooter">Scooter (2-wheeler)</option>
          <option value="other">Other / Shared Shuttle</option>
        </Select>

        <Input
          label="Manufacturer Company"
          placeholder="e.g. Honda, Suzuki, Hyundai"
          error={vehicleErrors?.company?.message}
          disabled={disabled}
          {...register('vehicle_information.company')}
        />

        <Input
          label="Vehicle Model Name"
          placeholder="e.g. Activa 6G, Swift LXi"
          error={vehicleErrors?.model?.message}
          disabled={disabled}
          {...register('vehicle_information.model')}
        />

        <Input
          label="Vehicle Color"
          placeholder="e.g. White, Black, Red"
          error={vehicleErrors?.color?.message}
          disabled={disabled}
          {...register('vehicle_information.color')}
        />

        <Input
          label="Registration Plate Number"
          placeholder="e.g. DL-3C-AB-1234"
          error={vehicleErrors?.registration_number?.message}
          disabled={disabled}
          {...register('vehicle_information.registration_number')}
        />

        <Input
          label="Offering Seats Capacity"
          type="number"
          placeholder="e.g. 1, 3, 4"
          error={vehicleErrors?.seat_capacity?.message}
          disabled={disabled}
          {...register('vehicle_information.seat_capacity', { valueAsNumber: true })}
        />
      </div>
    </div>
  );
};
export default VehicleSection;
