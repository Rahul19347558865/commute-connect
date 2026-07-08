import { supabase } from '../config/supabase.js';

export interface RideReview {
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

export interface SavedPlace {
  id: string;
  user_id: string;
  label: string;
  address: string;
  latitude: number;
  longitude: number;
  created_at: string;
}

/**
 * TrustService - Encapsulates reviews submission and saved locations bookmark operations.
 */
export class TrustService {
  /**
   * Publishes a review/rating.
   */
  static async createReview(
    rideId: string,
    reviewerId: string,
    revieweeId: string,
    rating: number,
    comment?: string
  ): Promise<RideReview> {
    if (rating < 1 || rating > 5) {
      throw new Error('Rating score must be integer bounded between 1 and 5 stars.');
    }

    const { data, error } = await supabase
      .from('ride_reviews')
      .insert({
        ride_id: rideId,
        reviewer_id: reviewerId,
        reviewee_id: revieweeId,
        rating,
        comment,
      })
      .select('*, reviewer:profiles(*)')
      .single();

    if (error) {
      throw new Error(`Database error publishing review: ${error.message}`);
    }
    return data as RideReview;
  }

  /**
   * Fetches reviews given to a user.
   */
  static async getReviewsForUser(userId: string): Promise<RideReview[]> {
    const { data, error } = await supabase
      .from('ride_reviews')
      .select('*, reviewer:profiles(*)')
      .eq('reviewee_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Database error fetching reviews: ${error.message}`);
    }
    return data as RideReview[];
  }

  /**
   * Creates a saved place bookmark.
   */
  static async createSavedPlace(
    userId: string,
    label: string,
    address: string,
    latitude: number,
    longitude: number
  ): Promise<SavedPlace> {
    const { data, error } = await supabase
      .from('saved_places')
      .insert({
        user_id: userId,
        label,
        address,
        latitude,
        longitude,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Database error saving place: ${error.message}`);
    }
    return data as SavedPlace;
  }

  /**
   * Lists saved places bookmarks for a user.
   */
  static async getSavedPlaces(userId: string): Promise<SavedPlace[]> {
    const { data, error } = await supabase
      .from('saved_places')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Database error fetching saved places: ${error.message}`);
    }
    return data as SavedPlace[];
  }

  /**
   * Deletes a saved place bookmark.
   */
  static async deleteSavedPlace(placeId: string, userId: string): Promise<boolean> {
    const { error } = await supabase
      .from('saved_places')
      .delete()
      .eq('id', placeId)
      .eq('user_id', userId);

    if (error) {
      throw new Error(`Database error deleting saved place: ${error.message}`);
    }
    return true;
  }
}
