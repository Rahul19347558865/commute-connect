import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../services/apiClient';

/**
 * useAdminStats - Query hook to fetch platform metrics for the admin control panel.
 */
export function useAdminStats() {
  return useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const response = await apiClient.get('/api/admin/dashboard');
      return response.data.data;
    },
  });
}

/**
 * useAdminUsers - Query hook to fetch all user profiles (admin only).
 */
export function useAdminUsers() {
  return useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const response = await apiClient.get('/api/admin/users');
      return response.data.data;
    },
  });
}

/**
 * useAdminRides - Query hook to fetch all ride offerings (admin only).
 */
export function useAdminRides() {
  return useQuery({
    queryKey: ['admin-rides'],
    queryFn: async () => {
      const response = await apiClient.get('/api/admin/rides');
      return response.data.data;
    },
  });
}

/**
 * useAdminBookings - Query hook to fetch all booking requests (admin only).
 */
export function useAdminBookings() {
  return useQuery({
    queryKey: ['admin-bookings'],
    queryFn: async () => {
      const response = await apiClient.get('/api/admin/bookings');
      return response.data.data;
    },
  });
}

/**
 * useAdminReports - Query hook to fetch all moderation reports (admin only).
 */
export function useAdminReports() {
  return useQuery({
    queryKey: ['admin-reports'],
    queryFn: async () => {
      const response = await apiClient.get('/api/admin/reports');
      return response.data.data;
    },
  });
}

/**
 * useResolveReport - Mutation hook to resolve or dismiss a report.
 */
export function useResolveReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ reportId, status }: { reportId: string; status: 'resolved' | 'dismissed' }) => {
      const response = await apiClient.patch(`/api/admin/reports/${reportId}`, { status });
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-reports'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
  });
}

/**
 * useSuspendUser - Mutation hook to suspend a user account.
 */
export function useSuspendUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId: string) => {
      const response = await apiClient.patch(`/api/admin/users/${userId}/suspend`);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
  });
}

/**
 * useRestoreUser - Mutation hook to restore a suspended user account.
 */
export function useRestoreUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId: string) => {
      const response = await apiClient.patch(`/api/admin/users/${userId}/restore`);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
  });
}

/**
 * useArchiveRide - Mutation hook to cancel/archive a ride offering.
 */
export function useArchiveRide() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (rideId: string) => {
      const response = await apiClient.patch(`/api/admin/rides/${rideId}/archive`);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-rides'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
  });
}

/**
 * useCreateReport - Mutation hook enabling standard users to report a user/ride.
 */
export function useCreateReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      reported_user_id?: string;
      reported_ride_id?: string;
      reported_review_id?: string;
      reason: string;
    }) => {
      const response = await apiClient.post('/reports', payload);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-reports'] });
    },
  });
}
