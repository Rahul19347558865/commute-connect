import { supabase } from '../config/supabase.js';

/**
 * DashboardService - Aggregates commuter dashboard statistics, active trip states,
 * and paginated ride history logs.
 */
export class DashboardService {
  /**
   * Compiles user dashboard statistics cards, active trips, and upcoming pools.
   */
  static async getDashboardStats(userId: string) {
    // 1. Fetch rides driven by user with trip sessions
    const { data: drivenRides } = await supabase
      .from('rides')
      .select('*, requests:ride_requests(*), trip_sessions(*)')
      .eq('driver_id', userId);

    // 2. Fetch bookings passenger joined with trip sessions
    const { data: bookings } = await supabase
      .from('ride_requests')
      .select('*, ride:rides(*, driver:profiles(*), trip_sessions(*))')
      .eq('passenger_id', userId);

    const completedDrives = (drivenRides || []).filter(
      (r) => r.trip_sessions && r.trip_sessions[0] && r.trip_sessions[0].status === 'completed'
    );
    const completedBookings = (bookings || []).filter(
      (b) => b.status === 'accepted' && b.ride?.trip_sessions && b.ride.trip_sessions[0] && b.ride.trip_sessions[0].status === 'completed'
    );

    const totalRides = completedDrives.length + completedBookings.length;

    // Sum passenger counts carried
    let totalPassengers = 0;
    completedDrives.forEach((r: any) => {
      const acceptedCount = (r.requests || []).filter((req: any) => req.status === 'accepted').length;
      totalPassengers += acceptedCount;
    });

    // Mock distance metric calculation (15km per completed pool)
    const distanceTravelled = totalRides * 15;

    // Money received (driver revenue)
    let moneyReceived = 0;
    completedDrives.forEach((r: any) => {
      const acceptedCount = (r.requests || []).filter((req: any) => req.status === 'accepted').length;
      if (r.contribution_type === 'paid') {
        moneyReceived += (r.contribution_amount || 0) * acceptedCount;
      }
    });

    // Money contributed (passenger paid amount)
    let moneyContributed = 0;
    completedBookings.forEach((b: any) => {
      if (b.ride && b.ride.contribution_type === 'paid') {
        moneyContributed += b.ride.contribution_amount || 0;
      }
    });

    // Upcoming rides (driver offers or accepted passenger bookings where trip session has not started)
    const upcomingDrives = (drivenRides || []).filter((r) => {
      const sessionStatus = r.trip_sessions && r.trip_sessions[0] ? r.trip_sessions[0].status : 'upcoming';
      return r.status === 'active' && sessionStatus === 'upcoming';
    });
    const upcomingPassengerBookings = (bookings || []).filter((b) => {
      if (b.status !== 'accepted' || !b.ride) return false;
      const sessionStatus = b.ride.trip_sessions && b.ride.trip_sessions[0] ? b.ride.trip_sessions[0].status : 'upcoming';
      return b.ride.status === 'active' && sessionStatus === 'upcoming';
    });

    const upcomingPassengerRides = upcomingPassengerBookings.map((b) => b.ride).filter(Boolean);
    const upcomingRides = [...upcomingDrives, ...upcomingPassengerRides].sort(
      (a, b) => new Date(a.departure_time).getTime() - new Date(b.departure_time).getTime()
    );

    // Active trip (is there a currently active trip session?)
    const activeDrive = (drivenRides || []).find(
      (r) => r.trip_sessions && r.trip_sessions[0] && r.trip_sessions[0].status === 'active'
    );
    const activeBooking = (bookings || []).find(
      (b) => b.status === 'accepted' && b.ride?.trip_sessions && b.ride.trip_sessions[0] && b.ride.trip_sessions[0].status === 'active'
    );
    const activeTrip = activeDrive || (activeBooking ? activeBooking.ride : null);

    return {
      stats: {
        totalRides,
        totalPassengers,
        distanceTravelled,
        moneyContributed,
        moneyReceived,
      },
      upcomingRides,
      activeTrip,
    };
  }

  /**
   * Retrieves user's completed and cancelled ride history.
   */
  static async getHistory(userId: string, page: number = 1, limit: number = 10) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // Fetch rides driven by user
    const { data: driven } = await supabase
      .from('rides')
      .select('*, driver:profiles(*)')
      .eq('driver_id', userId)
      .in('status', ['completed', 'cancelled']);

    // Fetch bookings requested
    const { data: bookings } = await supabase
      .from('ride_requests')
      .select('*, ride:rides(*, driver:profiles(*))')
      .eq('passenger_id', userId);

    const passengerRides = (bookings || [])
      .filter(
        (b) =>
          b.ride &&
          (b.ride.status === 'completed' || b.ride.status === 'cancelled' || b.status === 'cancelled')
      )
      .map((b) => ({
        ...b.ride,
        booking_status: b.status,
      }));

    const merged = [...(driven || []), ...passengerRides].sort(
      (a, b) => new Date(b.departure_time).getTime() - new Date(a.departure_time).getTime()
    );

    const paginated = merged.slice(from, to + 1);

    return {
      history: paginated,
      totalCount: merged.length,
    };
  }
}
