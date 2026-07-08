import { describe, test, expect, vi, beforeEach } from 'vitest';
import { profileUpdateSchema } from '../../routes/profileRoutes.js';
import { ProfileService } from '../profileService.js';
import { supabase } from '../../config/supabase.js';

// Mock the Supabase client config
vi.mock('../../config/supabase', () => {
  const mockSingle = vi.fn().mockResolvedValue({ data: null, error: null });
  const mockUpsert = vi.fn().mockReturnValue({ select: vi.fn().mockReturnValue({ single: mockSingle }) });
  const mockSelect = vi.fn().mockReturnValue({ eq: vi.fn().mockReturnValue({ single: mockSingle }) });

  return {
    supabase: {
      from: vi.fn().mockImplementation((table: string) => {
        if (table === 'profiles') {
          return {
            select: mockSelect,
            upsert: mockUpsert,
          };
        }
        return {
          delete: vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({ error: null }) }),
          upsert: vi.fn().mockResolvedValue({ error: null }),
        };
      }),
    },
  };
});

describe('Profile Validation & Service Layers', () => {
  describe('Zod Validation - profileUpdateSchema', () => {
    test('passes for valid passenger profile with optional vehicle fields left blank', () => {
      const payload = {
        full_name: 'Amit Patel',
        role: 'passenger',
        college_company: 'IIT Bombay',
        bio: 'Daily rider.',
        gender: 'male',
      };

      const result = profileUpdateSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });

    test('fails for driver profile when vehicle details are missing', () => {
      const payload = {
        full_name: 'Rahul Kumar',
        role: 'driver',
        college_company: 'Delhi University',
      };

      const result = profileUpdateSchema.safeParse(payload);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.vehicle_information).toContain(
          'Vehicle information details are mandatory for driver roles.'
        );
      }
    });

    test('passes for driver profile when complete vehicle details are supplied', () => {
      const payload = {
        full_name: 'Rahul Kumar',
        role: 'driver',
        college_company: 'Delhi University',
        vehicle_information: {
          vehicle_type: 'car',
          company: 'Maruti Suzuki',
          model: 'Swift',
          color: 'Red',
          registration_number: 'DL-4C-AB-9999',
          seat_capacity: 4,
        },
      };

      const result = profileUpdateSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });

    test('fails if seat capacity is negative or zero', () => {
      const payload = {
        full_name: 'Rahul Kumar',
        role: 'driver',
        college_company: 'Delhi University',
        vehicle_information: {
          vehicle_type: 'car',
          company: 'Maruti',
          model: 'Swift',
          color: 'Red',
          registration_number: 'DL-4C-AB-9999',
          seat_capacity: 0,
        },
      };

      const result = profileUpdateSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });
  });

  describe('ProfileService', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    test('calls supabase query with proper parameters on getProfile', async () => {
      await ProfileService.getProfile('user-id-777');
      
      expect(supabase.from).toHaveBeenCalledWith('profiles');
    });
  });
});
