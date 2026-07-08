import { supabase } from '../config/supabase.js';
import { RideService } from './rideService.js';
import { NotificationService } from './notificationService.js';

export interface BookingRequest {
  id: string;
  ride_id: string;
  passenger_id: string;
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled';
  created_at: string;
  updated_at: string;
}

/**
 * BookingService - Encapsulates all query operations and validation logic
 * on the PostgreSQL 'ride_requests' table.
 */
export class BookingService {
  /**
   * Submits a booking request from passenger.
   */
  static async createRequest(rideId: string, passengerId: string): Promise<BookingRequest> {
    // 1. Fetch ride details
    const ride = await RideService.getRideById(rideId);
    if (!ride) {
      throw new Error('Ride offering not found.');
    }

    // 2. Prevent drivers from booking their own rides
    if (ride.driver_id === passengerId) {
      throw new Error('Access denied: You cannot request bookings on your own ride offerings.');
    }

    // 3. Verify seat availability
    if (ride.available_seats <= 0) {
      throw new Error('Booking failed: No available seats remaining on this ride.');
    }

    // 4. Verify duplicate active requests
    const { data: existing, error: checkError } = await supabase
      .from('ride_requests')
      .select('id')
      .eq('ride_id', rideId)
      .eq('passenger_id', passengerId)
      .in('status', ['pending', 'accepted']);

    if (checkError) {
      throw new Error(`Database validation failed: ${checkError.message}`);
    }

    if (existing && existing.length > 0) {
      throw new Error('Booking failed: You already have an active request pending or accepted for this ride.');
    }

    // 5. Insert request record
    const { data, error } = await supabase
      .from('ride_requests')
      .insert({
        ride_id: rideId,
        passenger_id: passengerId,
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Database error submitting request: ${error.message}`);
    }

    // Notify driver about new pending request
    try {
      await NotificationService.createNotification(
        ride.driver_id,
        'New Booking Request',
        `A passenger has requested to join your ride pool from ${ride.pickup_location} to ${ride.destination}.`,
        'booking_request'
      );
    } catch (notifErr: any) {
      console.error('Failed to dispatch notification:', notifErr.message);
    }
    return data as BookingRequest;
  }

  /**
   * Lists booking requests issued for a ride offering (used by drivers).
   */
  static async getRequestsForRide(rideId: string, driverId: string) {
    const ride = await RideService.getRideById(rideId);
    if (!ride) {
      throw new Error('Ride offering not found.');
    }
    if (ride.driver_id !== driverId) {
      throw new Error('Access denied: Only the ride owner is permitted to view bookings list.');
    }

    const { data, error } = await supabase
      .from('ride_requests')
      .select('*, passenger:profiles(*)')
      .eq('ride_id', rideId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Database error fetching requests: ${error.message}`);
    }
    return data;
  }

  /**
   * Updates booking status (accept, reject, cancel). Automatically handles seats count.
   */
  static async updateRequestStatus(
    requestId: string,
    userId: string,
    newStatus: 'accepted' | 'rejected' | 'cancelled'
  ): Promise<BookingRequest> {
    // 1. Retrieve booking request
    const { data: request, error: fetchError } = await supabase
      .from('ride_requests')
      .select('*, ride:rides(*)')
      .eq('id', requestId)
      .single();

    if (fetchError || !request) {
      throw new Error('Booking request not found.');
    }

    const currentStatus = request.status;
    const ride = request.ride;

    if (currentStatus === newStatus) {
      return request as BookingRequest;
    }

    // 2. Validate ownership controls based on status change
    if (newStatus === 'cancelled') {
      // Passenger cancels
      if (request.passenger_id !== userId) {
        throw new Error('Access denied: You can only cancel your own bookings requests.');
      }
      
      // If was previously accepted, return seat to available pool
      if (currentStatus === 'accepted') {
        const { error: seatError } = await supabase
          .from('rides')
          .update({ available_seats: ride.available_seats + 1 })
          .eq('id', ride.id);
        if (seatError) throw new Error(`Failed to restore seat capacity: ${seatError.message}`);
      }
    } else {
      // Driver accepts/rejects
      if (ride.driver_id !== userId) {
        throw new Error('Access denied: Only the driver is permitted to accept or reject bookings.');
      }

      if (newStatus === 'accepted') {
        if (ride.available_seats <= 0) {
          throw new Error('Failed to accept booking: All seats have been filled.');
        }

        // Decrement seat
        const { error: seatError } = await supabase
          .from('rides')
          .update({ available_seats: ride.available_seats - 1 })
          .eq('id', ride.id);
        if (seatError) throw new Error(`Failed to update seats capacity: ${seatError.message}`);
      } else if (newStatus === 'rejected' && currentStatus === 'accepted') {
        // If driver accepts and later rejects, return seat
        const { error: seatError } = await supabase
          .from('rides')
          .update({ available_seats: ride.available_seats + 1 })
          .eq('id', ride.id);
        if (seatError) throw new Error(`Failed to restore seat capacity: ${seatError.message}`);
      }
    }

    // 3. Update requests table status
    const { data: updatedRequest, error: updateError } = await supabase
      .from('ride_requests')
      .update({
        status: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('id', requestId)
      .select()
      .single();

    if (updateError) {
      throw new Error(`Database error updating request: ${updateError.message}`);
    }

    // Notify users about status modifications
    try {
      if (newStatus === 'cancelled') {
        await NotificationService.createNotification(
          ride.driver_id,
          'Booking Request Cancelled',
          `A passenger has cancelled their booking request for your ride pool to ${ride.destination}.`,
          'booking_cancelled'
        );
      } else if (newStatus === 'accepted') {
        await NotificationService.createNotification(
          request.passenger_id,
          'Booking Request Approved!',
          `Pack your bags! Your request to join the ride pool to ${ride.destination} has been accepted.`,
          'booking_accepted'
        );
      } else if (newStatus === 'rejected') {
        await NotificationService.createNotification(
          request.passenger_id,
          'Booking Request Declined',
          `Your request to join the ride pool to ${ride.destination} was not accepted this time.`,
          'booking_rejected'
        );
      }
    } catch (notifErr: any) {
      console.error('Failed to dispatch notification:', notifErr.message);
    }

    return updatedRequest as BookingRequest;
  }

  /**
   * Retrieves booking requests history for a passenger.
   */
  static async getUserRequests(passengerId: string) {
    const { data, error } = await supabase
      .from('ride_requests')
      .select('*, ride:rides(*, driver:profiles(*, vehicle_information(*)))')
      .eq('passenger_id', passengerId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Database error retrieving bookings history: ${error.message}`);
    }
    return data;
  }
}
