import { supabase } from '../config/supabase.js';

export interface CCNotification {
  id: string;
  user_id: string;
  title: string;
  message_text: string;
  type: 'booking_request' | 'booking_accepted' | 'booking_rejected' | 'booking_cancelled' | 'chat_message' | 'other';
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * NotificationService - Encapsulates all query operations and creation triggers
 * on the PostgreSQL 'notifications' table.
 */
export class NotificationService {
  /**
   * Publishes a new notification record.
   */
  static async createNotification(
    userId: string,
    title: string,
    messageText: string,
    type: CCNotification['type']
  ): Promise<CCNotification> {
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        title,
        message_text: messageText,
        type,
        is_read: false,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Database error creating notification: ${error.message}`);
    }
    return data as CCNotification;
  }

  /**
   * Lists notifications for a specific user.
   */
  static async getNotifications(userId: string): Promise<CCNotification[]> {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Database error fetching notifications: ${error.message}`);
    }
    return data as CCNotification[];
  }

  /**
   * Marks a notification as read.
   */
  static async markAsRead(notificationId: string, userId: string): Promise<CCNotification> {
    const { data, error } = await supabase
      .from('notifications')
      .update({
        is_read: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', notificationId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      throw new Error(`Database error marking notification read: ${error.message}`);
    }
    return data as CCNotification;
  }
}
