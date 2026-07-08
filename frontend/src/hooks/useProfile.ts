import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthService } from '../services/authService';
import { apiClient } from '../services/apiClient';

/**
 * useProfile - TanStack Query hook to retrieve and cache the authenticated user profile.
 */
export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: AuthService.getProfile,
    retry: 1,
  });
}

/**
 * useUpdateProfile - TanStack Query mutation hook to update user profile metadata and vehicle specs.
 * Automatically invalidates the cached profile query on success.
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (profileData: any) => {
      const response = await apiClient.put('/api/profile', profileData);
      return response.data.data;
    },
    onSuccess: (data) => {
      // Direct query cache update for responsive visual feedback
      queryClient.setQueryData(['profile'], data);
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}

/**
 * useUploadAvatar - TanStack Query mutation hook to upload profile picture files to Cloudinary.
 * Invalidates user profile query on completion.
 */
export function useUploadAvatar() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('avatar', file);
      
      const response = await apiClient.post('/api/profile/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.avatarUrl;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}
