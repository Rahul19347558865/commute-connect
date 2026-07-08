import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '../services/supabase';
import { apiClient } from '../services/apiClient';

export interface TripSessionRecord {
  id: string;
  ride_id: string;
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  started_at?: string | null;
  ended_at?: string | null;
}

export interface DriverLocationRecord {
  ride_id: string;
  latitude: number;
  longitude: number;
  updated_at: string;
}

/**
 * useTripSession - Query hook to fetch the active trip session details.
 */
export function useTripSession(rideId: string) {
  return useQuery<TripSessionRecord | null>({
    queryKey: ['trip-session', rideId],
    queryFn: async () => {
      if (!rideId) return null;
      const response = await apiClient.get(`/api/trips/session/${rideId}`);
      return response.data.data;
    },
    enabled: !!rideId,
  });
}

/**
 * useStartTrip - Mutation hook to start a carpool trip session.
 */
export function useStartTrip() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (rideId: string) => {
      const response = await apiClient.post('/api/trips/start', { rideId });
      return response.data.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['trip-session', data.ride_id] });
      queryClient.invalidateQueries({ queryKey: ['ride', data.ride_id] });
    },
  });
}

/**
 * useEndTrip - Mutation hook to end a carpool trip session.
 */
export function useEndTrip() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (rideId: string) => {
      const response = await apiClient.post('/api/trips/end', { rideId });
      return response.data.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['trip-session', data.ride_id] });
      queryClient.invalidateQueries({ queryKey: ['ride', data.ride_id] });
    },
  });
}

/**
 * useUpdateDriverLocation - Mutation hook for uploading live driver GPS telemetry.
 */
export function useUpdateDriverLocation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      rideId,
      latitude,
      longitude,
    }: {
      rideId: string;
      latitude: number;
      longitude: number;
    }) => {
      const response = await apiClient.post('/api/location/update', {
        rideId,
        latitude,
        longitude,
      });
      return response.data.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['driver-location', data.ride_id], data);
    },
  });
}

/**
 * useDriverLocation - Query hook retrieving driver's last GPS coordinate payload.
 * Subscribes to Supabase Realtime for instant passenger map rendering updates.
 */
export function useDriverLocation(rideId: string) {
  const queryClient = useQueryClient();

  const query = useQuery<DriverLocationRecord | null>({
    queryKey: ['driver-location', rideId],
    queryFn: async () => {
      if (!rideId) return null;
      const response = await apiClient.get(`/api/location/${rideId}`);
      return response.data.data;
    },
    enabled: !!rideId,
  });

  useEffect(() => {
    if (!rideId) return;

    // Listen to changes on driver_locations for this ride
    const channel = supabase
      .channel(`driver-location-${rideId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'driver_locations',
          filter: `ride_id=eq.${rideId}`,
        },
        (payload: any) => {
          // Instantly patch query cache with updated driver coordinates
          queryClient.setQueryData(['driver-location', rideId], payload.new);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [rideId, queryClient]);

  return query;
}
