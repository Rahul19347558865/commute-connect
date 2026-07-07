import { describe, test, expect, vi, beforeEach } from 'vitest';
import { rideSchema } from '../../routes/rideRoutes.js';
import { RideService } from '../rideService.js';
import { supabase } from '../../config/supabase.js';

// Mock the Supabase client config
vi.mock('../../config/supabase', () => {
  const mockSingle = vi.fn().mockResolvedValue({ data: null, error: null });
  const mockInsert = vi.fn().mockReturnValue({ select: vi.fn().mockReturnValue({ single: mockSingle }) });
  const mockSelect = vi.fn().mockImplementation(() => {
    const chain = {
      order: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      ilike: vi.fn().mockReturnThis(),
      gte: vi.fn().mockReturnThis(),
      lte: vi.fn().mockReturnThis(),
      single: mockSingle,
    };
    // Ensure it is a Promise-like object so await resolves it
    Object.defineProperty(chain, 'then', {
      value: (onfulfilled: any) => Promise.resolve({ data: [], error: null }).then(onfulfilled),
      writable: true,
      configurable: true
    });
    return chain;
  });

  return {
    supabase: {
      from: vi.fn().mockImplementation(() => ({
        insert: mockInsert,
        select: mockSelect,
        update: vi.fn().mockReturnValue({ eq: vi.fn().mockReturnValue({ select: vi.fn().mockReturnValue({ single: mockSingle }) }) }),
        delete: vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({ error: null }) }),
      })),
    },
  };
});

describe('Ride Validation & Service Layers', () => {
  describe('Zod Validation - rideSchema', () => {
    const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    test('passes for valid free ride details in the future', () => {
      const payload = {
        pickup_location: 'IIT Campus Gate 1',
        pickup_latitude: 28.545,
        pickup_longitude: 77.192,
        destination: 'Connaught Place Metro',
        destination_latitude: 28.630,
        destination_longitude: 77.218,
        departure_time: futureDate,
        available_seats: 3,
        contribution_type: 'free',
      };

      const result = rideSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });

    test('fails when departure time is scheduled in the past', () => {
      const payload = {
        pickup_location: 'IIT Campus Gate 1',
        pickup_latitude: 28.545,
        pickup_longitude: 77.192,
        destination: 'Connaught Place',
        destination_latitude: 28.630,
        destination_longitude: 77.218,
        departure_time: pastDate,
        available_seats: 3,
        contribution_type: 'free',
      };

      const result = rideSchema.safeParse(payload);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.departure_time).toContain(
          'Departure time must be scheduled in the future.'
        );
      }
    });

    test('fails when latitude coordinates are outside bounds', () => {
      const payload = {
        pickup_location: 'IIT Gate',
        pickup_latitude: 95.0, // Invalid lat > 90
        pickup_longitude: 77.192,
        destination: 'CP',
        destination_latitude: 28.630,
        destination_longitude: 77.218,
        departure_time: futureDate,
        available_seats: 2,
        contribution_type: 'free',
      };

      const result = rideSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });

    test('fails for paid rides without an amount larger than zero', () => {
      const payload = {
        pickup_location: 'IIT Gate',
        pickup_latitude: 28.545,
        pickup_longitude: 77.192,
        destination: 'CP',
        destination_latitude: 28.630,
        destination_longitude: 77.218,
        departure_time: futureDate,
        available_seats: 4,
        contribution_type: 'paid',
        contribution_amount: 0,
      };

      const result = rideSchema.safeParse(payload);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.contribution_amount).toContain(
          'Paid rides require a contribution amount greater than zero.'
        );
      }
    });
  });

  describe('RideService', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    test('calls supabase query filters on listRides', async () => {
      await RideService.listRides({
        pickup: 'IIT',
        seats: 2,
      });

      expect(supabase.from).toHaveBeenCalledWith('rides');
    });
  });
});
