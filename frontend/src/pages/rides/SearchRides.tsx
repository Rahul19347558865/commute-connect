import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearchRides } from '../../hooks/useRides';
import { DashboardLayout } from '../../components/layouts/DashboardLayout';
import { RideFilters, FilterState } from '../../components/rides/RideFilters';
import { RideCard } from '../../components/rides/RideCard';
import { Button, Skeleton, EmptyState, ErrorState, SEO } from '../../components';
import { Plus } from '../../components/icons';

/**
 * SearchRidesPage - Discover and filter published ride offerings.
 * Performs client-side debounce mappings to query TanStack listings.
 */
export const SearchRidesPage: React.FC = () => {
  const navigate = useNavigate();
  
  const [filters, setFilters] = useState<FilterState>({});
  const [debouncedFilters, setDebouncedFilters] = useState<FilterState>({});

  // Debounce filter updates to prevent hitting endpoints on every key press
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilters(filters);
    }, 400);
    return () => clearTimeout(timer);
  }, [filters]);

  const { data: rides, isLoading, error, refetch } = useSearchRides(debouncedFilters);

  const handleResetFilters = () => {
    setFilters({});
  };

  return (
    <DashboardLayout activeTab="find-ride">
      <SEO
        title="Find Ride Pools"
        description="Search daily carpool offerings and matching passenger routes on Commute Connect."
      />
      <div className="space-y-6 animate-fade-in">
        {/* Header Action Jumbotron Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-h2 font-bold text-neutral-textMain dark:text-slate-100">
              Find a Ride
            </h1>
            <p className="text-small text-neutral-textSub dark:text-slate-400">
              Search shared pool rides matching your daily commute schedule.
            </p>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/rides/create')}
            leftIcon={<Plus className="w-4 h-4" />}
            className="w-fit"
          >
            Offer a Ride
          </Button>
        </div>

        {/* Dynamic Interactive Filter Panel */}
        <RideFilters
          filters={filters}
          onFilterChange={setFilters}
          onReset={handleResetFilters}
        />

        {/* Query State Listing Containers */}
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton variant="rect" height="150px" />
            <Skeleton variant="rect" height="150px" />
            <Skeleton variant="rect" height="150px" />
          </div>
        ) : error ? (
          <ErrorState
            title="Search failed"
            message={error.message || 'An error occurred fetching pool listings.'}
            onRetry={refetch}
          />
        ) : !rides || rides.length === 0 ? (
          <EmptyState
            title="No Pools Matching Filters"
            description="Try widening your search radius, resetting active filters, or creating your own ride offering."
            action={
              <Button variant="secondary" size="sm" onClick={handleResetFilters}>
                Clear All Filters
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {rides.map((ride: any) => (
              <RideCard key={ride.id} ride={ride} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
export default SearchRidesPage;
