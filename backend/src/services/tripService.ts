import { supabase } from '../config/supabase.js';
import { RideService } from './rideService.js';
import { ChatService } from './chatService.js';

export interface TripSession {
  id: string;
  ride_id: string;
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  started_at?: string | null;
  ended_at?: string | null;
  created_at: string;
}

export interface DriverLocation {
  id: string;
  ride_id: string;
  latitude: number;
  longitude: number;
  updated_at: string;
}

/**
 * TripService - Manages carpool ride navigation session states and driver
 * live location telemetry logs.
 */
export class TripService {
  /**
   * Starts a trip session (driver only).
   */
  static async startTrip(rideId: string, driverId: string): Promise<TripSession> {
    const ride = await RideService.getRideById(rideId);
    if (!ride) throw new Error('Ride offering not found.');
    if (ride.driver_id !== driverId) {
      throw new Error('Access denied: Only the assigned driver can start the trip.');
    }

    // Upsert trip session to active state
    const { data: session, error } = await supabase
      .from('trip_sessions')
      .upsert(
        {
          ride_id: rideId,
          status: 'active',
          started_at: new Date().toISOString(),
        },
        { onConflict: 'ride_id' }
      )
      .select()
      .single();

    if (error) {
      throw new Error(`Database error starting trip: ${error.message}`);
    }

    // Also update ride status to active
    await supabase.from('rides').update({ status: 'active' }).eq('id', rideId);

    return session as TripSession;
  }

  /**
   * Ends a trip session (driver only).
   */
  static async endTrip(rideId: string, driverId: string): Promise<TripSession> {
    const ride = await RideService.getRideById(rideId);
    if (!ride) throw new Error('Ride offering not found.');
    if (ride.driver_id !== driverId) {
      throw new Error('Access denied: Only the assigned driver can end the trip.');
    }

    const { data: session, error } = await supabase
      .from('trip_sessions')
      .update({
        status: 'completed',
        ended_at: new Date().toISOString(),
      })
      .eq('ride_id', rideId)
      .select()
      .single();

    if (error) {
      throw new Error(`Database error ending trip: ${error.message}`);
    }

    // Update ride offering status to completed
    await supabase.from('rides').update({ status: 'completed' }).eq('id', rideId);

    return session as TripSession;
  }

  /**
   * Updates driver's live GPS coordinates (driver only).
   */
  static async updateLocation(
    rideId: string,
    driverId: string,
    latitude: number,
    longitude: number
  ): Promise<DriverLocation> {
    const ride = await RideService.getRideById(rideId);
    if (!ride) throw new Error('Ride offering not found.');
    if (ride.driver_id !== driverId) {
      throw new Error('Access denied: Only the assigned driver can submit location updates.');
    }

    const { data: location, error } = await supabase
      .from('driver_locations')
      .upsert(
        {
          ride_id: rideId,
          latitude,
          longitude,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'ride_id' }
      )
      .select()
      .single();

    if (error) {
      throw new Error(`Database error updating location: ${error.message}`);
    }
    return location as DriverLocation;
  }

  /**
   * Retrieves driver's current coordinates.
   */
  static async getLocation(rideId: string, callerId: string): Promise<DriverLocation | null> {
    const isParticipant = await ChatService.verifyParticipant(rideId, callerId);
    if (!isParticipant) {
      throw new Error('Access denied: You must be a ride participant to track driver location.');
    }

    const { data, error } = await supabase
      .from('driver_locations')
      .select('*')
      .eq('ride_id', rideId)
      .maybeSingle();

    if (error) {
      throw new Error(`Database error fetching location: ${error.message}`);
    }
    return data as DriverLocation | null;
  }

  /**
   * Retrieves active trip session details.
   */
  static async getTripSession(rideId: string, callerId: string): Promise<TripSession | null> {
    const isParticipant = await ChatService.verifyParticipant(rideId, callerId);
    if (!isParticipant) {
      throw new Error('Access denied: You must be a ride participant to view trip sessions.');
    }

    const { data, error } = await supabase
      .from('trip_sessions')
      .select('*')
      .eq('ride_id', rideId)
      .maybeSingle();

    if (error) {
      throw new Error(`Database error fetching trip session: ${error.message}`);
    }
    return data as TripSession | null;
  }
}
