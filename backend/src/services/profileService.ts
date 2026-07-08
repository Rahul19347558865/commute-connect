import { supabase } from '../config/supabase.js';

export interface VehicleInfo {
  vehicle_type: string;
  company: string;
  model: string;
  color: string;
  registration_number: string;
  seat_capacity: number;
}

export interface ProfileDetails {
  id: string;
  email: string;
  full_name: string;
  role: 'driver' | 'passenger' | 'both' | 'admin';
  profile_photo?: string | null;
  college_company: string;
  bio?: string | null;
  gender?: string | null;
  contact_number?: string | null;
  emergency_contact?: string | null;
  preferred_pickup_area?: string | null;
  preferred_drop_area?: string | null;
  travel_preferences?: string | null;
  driver_verification_status?: 'pending' | 'verified' | 'rejected';
  passenger_preferences?: any;
}

export interface ProfileWithVehicle extends ProfileDetails {
  vehicle_information?: VehicleInfo | null;
}

/**
 * ProfileService - Service layer isolating all database operations
 * on 'profiles' and 'vehicle_information' tables.
 */
export class ProfileService {
  /**
   * Retrieves profile data merged with vehicle details.
   */
  static async getProfile(id: string): Promise<ProfileWithVehicle | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*, vehicle_information(*)')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Database error fetching profile: ${error.message}`);
    }

    return data as ProfileWithVehicle;
  }

  /**
   * Upserts profile records and conditional vehicle details.
   */
  static async upsertProfile(
    id: string,
    profileData: Omit<ProfileDetails, 'id' | 'email'>,
    vehicleData?: VehicleInfo
  ): Promise<ProfileWithVehicle> {
    // 1. Upsert profile table
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({ id, ...profileData }, { onConflict: 'id' });

    if (profileError) {
      throw new Error(`Database error upserting profile: ${profileError.message}`);
    }

    // 2. Handle vehicle information table based on role
    const isDriver = profileData.role === 'driver' || profileData.role === 'both';

    if (isDriver && vehicleData) {
      const { error: vehicleError } = await supabase
        .from('vehicle_information')
        .upsert({ id, ...vehicleData }, { onConflict: 'id' });

      if (vehicleError) {
        throw new Error(`Database error upserting vehicle info: ${vehicleError.message}`);
      }
    } else {
      // If role is passenger, remove vehicle info if it existed
      const { error: deleteError } = await supabase
        .from('vehicle_information')
        .delete()
        .eq('id', id);

      if (deleteError) {
        console.warn(`Failed to clear vehicle info for user ${id}: ${deleteError.message}`);
      }
    }

    // 3. Return refreshed complete record
    const updatedProfile = await this.getProfile(id);
    if (!updatedProfile) {
      throw new Error('Failed to retrieve profile record after upsert operations.');
    }
    return updatedProfile;
  }

  /**
   * Updates only the profile photo avatar url.
   */
  static async updateAvatar(id: string, avatarUrl: string): Promise<string> {
    const { error } = await supabase
      .from('profiles')
      .update({ profile_photo: avatarUrl, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      throw new Error(`Database error updating profile avatar: ${error.message}`);
    }
    return avatarUrl;
  }
}
