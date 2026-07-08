import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '../services/supabase';
import { apiClient } from '../services/apiClient';
import { useAuth } from '../context/AuthContext';

export interface CCNotification {
  id: string;
  user_id: string;
  title: string;
  message_text: string;
  type: 'booking_request' | 'booking_accepted' | 'booking_rejected' | 'booking_cancelled' | 'chat_message' | 'other';
  is_read: boolean;
  created_at: string;
}

// Global states for reference counting to prevent duplicate channel subscriptions across concurrent component mounts
let globalChannel: any = null;
let currentSubscribedUserId: string | null = null;
let subscriptionCount = 0;

/**
 * useNotificationsList - Query hook to fetch user notifications history list.
 * Subscribes to Supabase Realtime for user alerts changes.
 */
export function useNotificationsList() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const query = useQuery<CCNotification[]>({
    queryKey: ['notifications'],
    queryFn: async () => {
      const response = await apiClient.get('/api/notifications');
      return response.data.data;
    },
    enabled: !!user?.id,
  });

  useEffect(() => {
    if (!user?.id) return;

    // If target user changed, reset reference tracking instantly
    if (globalChannel && currentSubscribedUserId !== user.id) {
      supabase.removeChannel(globalChannel);
      globalChannel = null;
      subscriptionCount = 0;
    }

    subscriptionCount++;
    currentSubscribedUserId = user.id;

    if (!globalChannel) {
      globalChannel = supabase
        .channel(`user-notifications-${user.id}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user.id}`,
          },
          () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
          }
        )
        .subscribe();
    }

    return () => {
      subscriptionCount--;
      if (subscriptionCount <= 0 && globalChannel) {
        supabase.removeChannel(globalChannel);
        globalChannel = null;
        currentSubscribedUserId = null;
        subscriptionCount = 0;
      }
    };
  }, [user?.id, queryClient]);

  return query;
}

/**
 * useMarkNotificationRead - Mutation hook to mark a specific notification as read.
 */
export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.patch(`/api/notifications/${id}/read`);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}
