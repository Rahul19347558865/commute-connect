import { supabase } from '../config/supabase.js';

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalRides: number;
  activeRides: number;
  completedRides: number;
  pendingBookings: number;
  totalReviews: number;
  averageRating: number;
}

/**
 * AdminService - Central service layer handling platform moderation,
 * reviews removal, reports resolution, and system status queries.
 */
export class AdminService {
  /**
   * Aggregates platform statistics for admin dashboard.
   */
  static async getDashboardStats(): Promise<AdminStats> {
    const [
      { count: totalUsers },
      { count: activeRides },
      { count: completedRides },
      { count: totalRides },
      { count: pendingBookings },
      { count: totalReviews },
      { data: ratings },
    ] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('rides').select('*', { count: 'exact', head: true }).eq('status', 'active'),
      supabase.from('rides').select('*', { count: 'exact', head: true }).eq('status', 'completed'),
      supabase.from('rides').select('*', { count: 'exact', head: true }),
      supabase.from('ride_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('ride_reviews').select('*', { count: 'exact', head: true }),
      supabase.from('ride_reviews').select('rating'),
    ]);

    const reviewRatings = ratings || [];
    const avg = reviewRatings.length > 0
      ? reviewRatings.reduce((acc, r) => acc + r.rating, 0) / reviewRatings.length
      : 5.0;

    return {
      totalUsers: totalUsers || 0,
      activeUsers: totalUsers ? Math.ceil(totalUsers * 0.7) : 0, // Mock active fraction based on profile volumes
      totalRides: totalRides || 0,
      activeRides: activeRides || 0,
      completedRides: completedRides || 0,
      pendingBookings: pendingBookings || 0,
      totalReviews: totalReviews || 0,
      averageRating: Number(avg.toFixed(1)),
    };
  }

  /**
   * Lists all user profiles.
   */
  static async getUsers() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Failed to list users: ${error.message}`);
    return data;
  }

  /**
   * Lists all rides.
   */
  static async getRides() {
    const { data, error } = await supabase
      .from('rides')
      .select('*, driver:profiles(*)')
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Failed to list rides: ${error.message}`);
    return data;
  }

  /**
   * Lists all bookings.
   */
  static async getBookings() {
    const { data, error } = await supabase
      .from('ride_requests')
      .select('*, ride:rides(*, driver:profiles(*)), passenger:profiles(*)')
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Failed to list bookings: ${error.message}`);
    return data;
  }

  /**
   * Lists reports.
   */
  static async getReports() {
    const { data, error } = await supabase
      .from('reports')
      .select('*, reporter:profiles(*), reported_user:profiles(*), reported_ride:rides(*)')
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Failed to list reports: ${error.message}`);
    return data;
  }

  /**
   * Resolves or dismisses a report.
   */
  static async resolveReport(reportId: string, status: 'resolved' | 'dismissed') {
    const { data, error } = await supabase
      .from('reports')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', reportId)
      .select()
      .single();

    if (error) throw new Error(`Failed to resolve report: ${error.message}`);
    return data;
  }

  /**
   * Suspends a user profile.
   */
  static async suspendUser(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        driver_verification_status: 'rejected',
        bio: '[SUSPENDED USER ACCOUNT FOR POLICY VIOLATIONS]',
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw new Error(`Failed to suspend user: ${error.message}`);
    return data;
  }

  /**
   * Restores a suspended user profile.
   */
  static async restoreUser(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        driver_verification_status: 'verified',
        bio: 'Commutes regularly with Commute Connect.',
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw new Error(`Failed to restore user: ${error.message}`);
    return data;
  }

  /**
   * Deletes inappropriate reviews.
   */
  static async deleteReview(reviewId: string) {
    const { error } = await supabase.from('ride_reviews').delete().eq('id', reviewId);
    if (error) throw new Error(`Failed to moderate review: ${error.message}`);
    return true;
  }

  /**
   * Archives/Cancels rides.
   */
  static async archiveRide(rideId: string) {
    const { data, error } = await supabase
      .from('rides')
      .update({ status: 'cancelled' })
      .eq('id', rideId)
      .select()
      .single();

    if (error) throw new Error(`Failed to archive ride: ${error.message}`);
    return data;
  }
}
