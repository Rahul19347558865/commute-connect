import { supabase } from '../config/supabase.js';

export interface CreateRideParams {
  pickup_location: string;
  pickup_latitude: number;
  pickup_longitude: number;
  destination: string;
  destination_latitude: number;
  destination_longitude: number;
  departure_time: string;
  available_seats: number;
  contribution_type: 'free' | 'paid' | 'co-travel';
  contribution_amount?: number;
  notes?: string | null;
}

export interface RideFilters {
  pickup?: string;
  destination?: string;
  date?: string; // ISO date string (YYYY-MM-DD)
  seats?: number;
  contribution_type?: string;
  status?: 'active' | 'completed' | 'cancelled';
  vehicle_type?: string;
  sortBy?: string;
  page?: number;
  limit?: number;
}

/**
 * RideService - Service layer encapsulating all queries and mutations
 * on the PostgreSQL 'rides' database table.
 */
export class RideService {
  /**
   * Creates a new ride offering.
   */
  static async createRide(driverId: string, rideData: CreateRideParams) {
    const { data, error } = await supabase
      .from('rides')
      .insert({
        driver_id: driverId,
        ...rideData,
      })
      .select('*, driver:profiles(*, vehicle_information(*))')
      .single();

    if (error) {
      throw new Error(`Database error creating ride: ${error.message}`);
    }
    return data;
  }

  /**
   * Fetches rides matching filters (ilike searches, seats gte, and dates).
   */
  static async listRides(filters: RideFilters) {
    let query = supabase
      .from('rides')
      .select('*, driver:profiles(*, vehicle_information(*))');

    // 1. Vehicle Type Nested Table Filter (Sub-Query optimization)
    if (filters.vehicle_type) {
      const { data: vehicles } = await supabase
        .from('vehicle_information')
        .select('id')
        .eq('vehicle_type', filters.vehicle_type);

      const driverIds = (vehicles || []).map((v) => v.id);
      query = query.in(
        'driver_id',
        driverIds.length > 0 ? driverIds : ['00000000-0000-0000-0000-000000000000']
      );
    }

    // 2. Standard Filters
    query = query.eq('status', filters.status || 'active');

    if (filters.pickup) {
      query = query.ilike('pickup_location', `%${filters.pickup}%`);
    }

    if (filters.destination) {
      query = query.ilike('destination', `%${filters.destination}%`);
    }

    if (filters.seats) {
      query = query.gte('available_seats', filters.seats);
    }

    if (filters.contribution_type) {
      query = query.eq('contribution_type', filters.contribution_type);
    }

    if (filters.date) {
      const startOfDay = new Date(filters.date);
      startOfDay.setUTCHours(0, 0, 0, 0);

      const endOfDay = new Date(filters.date);
      endOfDay.setUTCHours(23, 59, 59, 999);

      query = query
        .gte('departure_time', startOfDay.toISOString())
        .lte('departure_time', endOfDay.toISOString());
    }

    // 3. Dynamic Sorting Mappings
    let sortColumn = 'departure_time';
    let sortAscending = true;

    if (filters.sortBy === 'latest_departure') {
      sortColumn = 'departure_time';
      sortAscending = false;
    } else if (filters.sortBy === 'lowest_contribution') {
      sortColumn = 'contribution_amount';
      sortAscending = true;
    } else if (filters.sortBy === 'newest') {
      sortColumn = 'created_at';
      sortAscending = false;
    }

    query = query.order(sortColumn, { ascending: sortAscending });

    // 4. Pagination Ranges
    if (filters.page && filters.limit) {
      const from = (filters.page - 1) * filters.limit;
      const to = from + filters.limit - 1;
      query = query.range(from, to);
    }

    const { data, error } = await query;
    if (error) {
      throw new Error(`Database error listing rides: ${error.message}`);
    }
    return data;
  }

  /**
   * Fetches details of a single ride.
   */
  static async getRideById(id: string) {
    const { data, error } = await supabase
      .from('rides')
      .select('*, driver:profiles(*, vehicle_information(*))')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Database error fetching ride: ${error.message}`);
    }
    return data;
  }

  /**
   * Updates an existing ride. Enforces driver ownership check.
   */
  static async updateRide(id: string, driverId: string, rideData: Partial<CreateRideParams>) {
    // 1. Verify ownership first
    const existing = await this.getRideById(id);
    if (!existing) {
      return null;
    }
    if (existing.driver_id !== driverId) {
      throw new Error('Access denied: Only the ride owner is permitted to update details.');
    }

    // 2. Perform update
    const { data, error } = await supabase
      .from('rides')
      .update({
        ...rideData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select('*, driver:profiles(*, vehicle_information(*))')
      .single();

    if (error) {
      throw new Error(`Database error updating ride: ${error.message}`);
    }
    return data;
  }

  /**
   * Deletes (cancels) a ride. Enforces ownership check.
   */
  static async deleteRide(id: string, driverId: string) {
    // 1. Verify ownership
    const existing = await this.getRideById(id);
    if (!existing) {
      return false;
    }
    if (existing.driver_id !== driverId) {
      throw new Error('Access denied: Only the ride owner is permitted to delete this offering.');
    }

    // 2. Delete the record (or we could set status = 'cancelled')
    // The prompt specifies "DELETE /api/rides/:id", so we perform a deletion.
    const { error } = await supabase
      .from('rides')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Database error deleting ride: ${error.message}`);
    }
    return true;
  }
}
