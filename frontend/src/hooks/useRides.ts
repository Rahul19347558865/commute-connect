import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../services/apiClient';

export interface CreateRidePayload {
  pickup_location: string;
  pickup_latitude: number;
  pickup_longitude: number;
  destination: string;
  destination_latitude: number;
  destination_longitude: number;
  departure_time: string;
  available_seats: number;
  contribution_type: 'free' | 'paid' | 'co-travel';
  contribution_amount?: number;
  notes?: string | null;
}

/**
 * useCreateRide - Mutation hook to post a new ride offering.
 * Invalidates the 'rides' queries cache list upon success.
 */
export function useCreateRide() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (rideData: CreateRidePayload) => {
      const response = await apiClient.post('/api/rides', rideData);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rides'] });
    },
  });
}

export function useRide(id: string) {
  return useQuery({
    queryKey: ['ride', id],
    queryFn: async () => {
      if (!id) return null;
      const response = await apiClient.get(`/api/rides/${id}`);
      return response.data.data;
    },
    enabled: !!id,
    retry: 1,
  });
}

/**
 * useRideDetails - Query hook to fetch detailed ride data by its ID (reuses useRide logic).
 */
export const useRideDetails = useRide;

/**
 * useSearchRides - TanStack Query hook to search rides based on active filters list.
 */
export function useSearchRides(filters: any) {
  return useQuery({
    queryKey: ['rides', filters],
    queryFn: async () => {
      const response = await apiClient.get('/api/rides', { params: filters });
      return response.data.data;
    },
  });
}
