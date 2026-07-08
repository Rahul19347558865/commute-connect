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

/**
 * useCreateRequest - Mutation hook to submit booking request on a ride.
 * Invalidates specific ride detail caches and history lists on success.
 */
export function useCreateRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (rideId: string) => {
      const response = await apiClient.post(`/api/rides/${rideId}/request`);
      return response.data.data;
    },
    onSuccess: (_, rideId) => {
      queryClient.invalidateQueries({ queryKey: ['ride', rideId] });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['rides'] });
    },
  });
}

/**
 * useRideRequests - Query hook fetching list of passenger requests for a driver's ride.
 */
export function useRideRequests(rideId: string) {
  return useQuery({
    queryKey: ['ride-requests', rideId],
    queryFn: async () => {
      if (!rideId) return [];
      const response = await apiClient.get(`/api/rides/${rideId}/requests`);
      return response.data.data;
    },
    enabled: !!rideId,
  });
}

/**
 * useUpdateRequestStatus - Mutation hook to accept, reject, or cancel passenger booking requests.
 */
export function useUpdateRequestStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ requestId, status }: { requestId: string; status: 'accepted' | 'rejected' | 'cancelled' }) => {
      const response = await apiClient.patch(`/api/rides/requests/${requestId}`, { status });
      return response.data.data;
    },
    onSuccess: (data) => {
      // Invalidate target query caches to trigger instant data refreshes
      queryClient.invalidateQueries({ queryKey: ['ride', data.ride_id] });
      queryClient.invalidateQueries({ queryKey: ['ride-requests', data.ride_id] });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['rides'] });
    },
  });
}

/**
 * usePassengerBookings - Query hook for fetching passenger's requests/bookings history list.
 */
export function usePassengerBookings() {
  return useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      const response = await apiClient.get('/api/rides/requests/passenger');
      return response.data.data;
    },
  });
}
