import { supabase } from '../config/supabase.js';
import { RideService } from './rideService.js';

export interface ChatMessage {
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
 * ChatService - Encapsulates all query operations and access validation checks
 * on the PostgreSQL 'chat_messages' table.
 */
export class ChatService {
  /**
   * Asserts if a caller is authorized to participate in the ride chat channel.
   */
  static async verifyParticipant(rideId: string, userId: string): Promise<boolean> {
    const ride = await RideService.getRideById(rideId);
    if (!ride) return false;
    
    if (ride.driver_id === userId) return true;

    const { data } = await supabase
      .from('ride_requests')
      .select('id')
      .eq('ride_id', rideId)
      .eq('passenger_id', userId)
      .eq('status', 'accepted');

    return !!(data && data.length > 0);
  }

  /**
   * Fetches messages in chronological order for a ride channel.
   */
  static async getMessages(rideId: string, callerId: string): Promise<ChatMessage[]> {
    const isParticipant = await this.verifyParticipant(rideId, callerId);
    if (!isParticipant) {
      throw new Error('Access denied: You must be a verified ride participant to view chat logs.');
    }

    const { data, error } = await supabase
      .from('chat_messages')
      .select('*, sender:profiles(*)')
      .eq('ride_id', rideId)
      .order('created_at', { ascending: true });

    if (error) {
      throw new Error(`Database error fetching messages: ${error.message}`);
    }
    return data as ChatMessage[];
  }

  /**
   * Publishes a chat message.
   */
  static async sendMessage(rideId: string, senderId: string, text: string): Promise<ChatMessage> {
    const isParticipant = await this.verifyParticipant(rideId, senderId);
    if (!isParticipant) {
      throw new Error('Access denied: You must be a verified ride participant to post messages.');
    }

    const { data, error } = await supabase
      .from('chat_messages')
      .insert({
        ride_id: rideId,
        sender_id: senderId,
        message_text: text,
      })
      .select('*, sender:profiles(*)')
      .single();

    if (error) {
      throw new Error(`Database error posting message: ${error.message}`);
    }
    return data as ChatMessage;
  }
}
