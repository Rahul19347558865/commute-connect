import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '../services/supabase';
import { apiClient } from '../services/apiClient';
import { useAuth } from '../context/AuthContext';

export interface MessageRecord {
  id: string;
  ride_id: string;
  sender_id: string;
  message_text: string;
  created_at: string;
  sender?: {
    full_name: string;
    profile_photo?: string | null;
  };
}

/**
 * useChatMessages - Query hook to fetch chat messages for a ride offering.
 * Subscribes to Supabase Realtime changes and auto-unmounts on exit.
 */
export function useChatMessages(rideId: string) {
  const queryClient = useQueryClient();

  const query = useQuery<MessageRecord[]>({
    queryKey: ['chat-messages', rideId],
    queryFn: async () => {
      const response = await apiClient.get(`/api/chat/${rideId}/messages`);
      return response.data.data;
    },
    enabled: !!rideId,
  });

  useEffect(() => {
    if (!rideId) return;

    const channel = supabase
      .channel(`chat-room-${rideId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `ride_id=eq.${rideId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['chat-messages', rideId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [rideId, queryClient]);

  return query;
}

/**
 * useSendMessage - Mutation hook to post a message to the ride's conversation channel.
 */
export function useSendMessage(rideId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (text: string) => {
      const response = await apiClient.post(`/api/chat/${rideId}/message`, { message_text: text });
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat-messages', rideId] });
    },
  });
}

/**
 * useChatConversations - Hook that queries and returns all ride offerings
 * the authenticated user is participating in where a booking has been accepted.
 */
export function useChatConversations() {
  const { user } = useAuth();

  const query = useQuery({
    queryKey: ['chat-conversations', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('ride_requests')
        .select('*, ride:rides(*, driver:profiles(*, vehicle_information(*)))')
        .eq('status', 'accepted');

      if (error) {
        throw new Error(error.message);
      }

      const ridesMap = new Map();
      (data || []).forEach((req: any) => {
        if (req.ride) {
          ridesMap.set(req.ride.id, req.ride);
        }
      });

      return Array.from(ridesMap.values());
    },
    enabled: !!user?.id,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
