import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../services/apiClient';

export interface SavedPlaceRecord {
  id: string;
  label: string;
  address: string;
  latitude: number;
  longitude: number;
}

export interface ReviewRecord {
  id: string;
  ride_id: string;
  reviewer_id: string;
  reviewee_id: string;
  rating: number;
  comment?: string | null;
  created_at: string;
  reviewer?: {
    full_name: string;
    profile_photo?: string | null;
  };
}

/**
 * useDashboard - Query hook fetching dashboard stats, active ride, and upcoming schedules.
 */
export function useDashboard() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const response = await apiClient.get('/api/dashboard');
      return response.data.data;
    },
    staleTime: 30000, // 30 seconds caching
  });
}

/**
 * useRideHistory - Query hook fetching user completed/cancelled rides list.
 */
export function useRideHistory(page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: ['ride-history', page, limit],
    queryFn: async () => {
      const response = await apiClient.get('/api/history', { params: { page, limit } });
      return response.data.data;
    },
  });
}

/**
 * useSavedPlaces - Query hook fetching user bookmarked locations list.
 */
export function useSavedPlaces() {
  return useQuery<SavedPlaceRecord[]>({
    queryKey: ['saved-places'],
    queryFn: async () => {
      const response = await apiClient.get('/api/saved-places');
      return response.data.data;
    },
  });
}

/**
 * useAddSavedPlace - Mutation hook to save a bookmark location.
 */
export function useAddSavedPlace() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { label: string; address: string; latitude: number; longitude: number }) => {
      const response = await apiClient.post('/api/saved-places', payload);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-places'] });
    },
  });
}

/**
 * useDeleteSavedPlace - Mutation hook to delete a saved location.
 */
export function useDeleteSavedPlace() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/api/saved-places/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-places'] });
    },
  });
}

/**
 * useAddReview - Mutation hook to post reviews and ratings scores.
 */
export function useAddReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { ride_id: string; reviewee_id: string; rating: number; comment?: string }) => {
      const response = await apiClient.post('/api/reviews', payload);
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['user-reviews', variables.reviewee_id] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}

/**
 * useUserReviews - Query hook fetching public reviews posted to a user.
 */
export function useUserReviews(userId: string) {
  return useQuery<ReviewRecord[]>({
    queryKey: ['user-reviews', userId],
    queryFn: async () => {
      if (!userId) return [];
      const response = await apiClient.get(`/api/reviews/${userId}`);
      return response.data.data;
    },
    enabled: !!userId,
  });
}
