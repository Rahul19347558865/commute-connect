import React from 'react';
import { LocationAutocomplete } from './LocationAutocomplete';
import { Select } from '../ui/Select';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

export interface FilterState {
  pickup?: string;
  destination?: string;
  date?: string;
  seats?: number;
  contribution_type?: string;
  vehicle_type?: string;
  sortBy?: string;
}

interface RideFiltersProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  onReset: () => void;
}

/**
 * RideFilters - Control panel to filter and sort commuter ride offerings.
 * Exposes Autocompletes, seats thresholds, sorting, and reset filters actions.
 */
export const RideFilters: React.FC<RideFiltersProps> = ({
  filters,
  onFilterChange,
  onReset,
}) => {
  const handleSelectPickup = (val: { address: string }) => {
    onFilterChange({ ...filters, pickup: val.address });
  };

  const handleSelectDestination = (val: { address: string }) => {
    onFilterChange({ ...filters, destination: val.address });
  };

  return (
    <div className="p-5 rounded-radius-lg bg-neutral-surface dark:bg-slate-900 border border-neutral-borderLine dark:border-slate-800 shadow-shadow-small space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <LocationAutocomplete
          label="Pickup Location"
          placeholder="Filter by pickup address..."
          initialValue={filters.pickup || ''}
          onSelect={handleSelectPickup}
        />

        <LocationAutocomplete
          label="Destination Location"
          placeholder="Filter by destination address..."
          initialValue={filters.destination || ''}
          onSelect={handleSelectDestination}
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
        <Input
          label="Departure Date"
          type="date"
          value={filters.date || ''}
          onChange={(e) => onFilterChange({ ...filters, date: e.target.value })}
        />

        <Input
          label="Min Seats"
          type="number"
          placeholder="e.g. 2"
          value={filters.seats || ''}
          onChange={(e) =>
            onFilterChange({
              ...filters,
              seats: e.target.value ? parseInt(e.target.value, 10) : undefined,
            })
          }
        />

        <Select
          label="Contribution"
          value={filters.contribution_type || ''}
          onChange={(e) => onFilterChange({ ...filters, contribution_type: e.target.value })}
        >
          <option value="">Any Policy</option>
          <option value="free">Free</option>
          <option value="co-travel">Co-Travel</option>
          <option value="paid">Paid</option>
        </Select>

        <Select
          label="Vehicle Type"
          value={filters.vehicle_type || ''}
          onChange={(e) => onFilterChange({ ...filters, vehicle_type: e.target.value })}
        >
          <option value="">Any Vehicle</option>
          <option value="car">Car</option>
          <option value="bike">Bike</option>
          <option value="scooter">Scooter</option>
          <option value="other">Other</option>
        </Select>

        <Select
          label="Sort By"
          value={filters.sortBy || ''}
          onChange={(e) => onFilterChange({ ...filters, sortBy: e.target.value })}
        >
          <option value="">Earliest Departure</option>
          <option value="latest_departure">Latest Departure</option>
          <option value="lowest_contribution">Lowest Contribution</option>
          <option value="newest">Newest Publish</option>
        </Select>

        <div className="flex items-end pb-0.5">
          <Button variant="secondary" size="sm" onClick={onReset} className="w-full h-10 font-semibold">
            Reset Filters
          </Button>
        </div>
      </div>
    </div>
  );
};
export default RideFilters;
