import { supabase } from '../config/supabase.js';

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  role: 'driver' | 'passenger' | 'both' | 'admin';
  profile_photo?: string;
  college_company: string;
  bio?: string;
  vehicle_type?: string;
  vehicle_number?: string;
  rating?: number;
  reviews_count?: number;
  vehicle_information?: any;
}

/**
 * Service class managing database operations on the public 'profiles' and 'vehicle_information' tables.
 */
export class UserService {
  /**
   * Fetches user profile record by primary key UUID
   */
  static async getUserProfile(id: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*, vehicle_information(*)')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Record not found
        return null;
      }
      throw new Error(`Failed to fetch user profile: ${error.message}`);
    }

    const profile = data as any;
    const vehicle = profile.vehicle_information;
    return {
      id: profile.id,
      full_name: profile.full_name,
      email: profile.email,
      role: profile.role,
      profile_photo: profile.profile_photo || undefined,
      college_company: profile.college_company,
      bio: profile.bio || undefined,
      vehicle_type: vehicle?.vehicle_type || undefined,
      vehicle_number: vehicle?.registration_number || undefined,
      rating: profile.rating || undefined,
      reviews_count: profile.reviews_count || undefined,
      vehicle_information: vehicle || undefined,
    };
  }

  /**
   * Inserts a new user profile record
   */
  static async createUserProfile(profile: UserProfile): Promise<UserProfile> {
    // 1. Insert into profiles table
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([{
        id: profile.id,
        email: profile.email,
        full_name: profile.full_name,
        role: profile.role,
        profile_photo: profile.profile_photo || null,
        college_company: profile.college_company,
        bio: profile.bio || null,
      }]);

    if (profileError) {
      throw new Error(`Failed to create user profile: ${profileError.message}`);
    }

    // 2. Insert into vehicle_information table if role is driver/both and vehicle_type is provided
    const isDriver = profile.role === 'driver' || profile.role === 'both';
    if (isDriver && profile.vehicle_type) {
      const { error: vehicleError } = await supabase
        .from('vehicle_information')
        .insert([{
          id: profile.id,
          vehicle_type: profile.vehicle_type,
          company: profile.vehicle_type.split(' ')[0] || 'Default',
          model: profile.vehicle_type,
          color: 'Default',
          registration_number: profile.vehicle_number || 'PENDING',
          seat_capacity: 4,
        }]);

      if (vehicleError) {
        console.error('Failed to create vehicle info:', vehicleError.message);
      }
    }

    const created = await this.getUserProfile(profile.id);
    if (!created) {
      throw new Error('Failed to retrieve user profile after creation.');
    }
    return created;
  }

  /**
   * Updates an existing user profile record
   */
  static async updateUserProfile(id: string, profile: Partial<UserProfile>): Promise<UserProfile> {
    // 1. Update profiles table if profile fields are updated
    const profileUpdate: any = {};
    if (profile.full_name !== undefined) profileUpdate.full_name = profile.full_name;
    if (profile.role !== undefined) profileUpdate.role = profile.role;
    if (profile.profile_photo !== undefined) profileUpdate.profile_photo = profile.profile_photo;
    if (profile.college_company !== undefined) profileUpdate.college_company = profile.college_company;
    if (profile.bio !== undefined) profileUpdate.bio = profile.bio;

    if (Object.keys(profileUpdate).length > 0) {
      const { error: profileError } = await supabase
        .from('profiles')
        .update(profileUpdate)
        .eq('id', id);

      if (profileError) {
        throw new Error(`Failed to update user profile: ${profileError.message}`);
      }
    }

    // 2. Update vehicle_information if vehicle fields are updated
    if (profile.vehicle_type !== undefined || profile.vehicle_number !== undefined) {
      const vehicleUpdate: any = {};
      if (profile.vehicle_type !== undefined) {
        vehicleUpdate.vehicle_type = profile.vehicle_type;
        vehicleUpdate.model = profile.vehicle_type;
        vehicleUpdate.company = profile.vehicle_type.split(' ')[0] || 'Default';
      }
      if (profile.vehicle_number !== undefined) {
        vehicleUpdate.registration_number = profile.vehicle_number;
      }

      const { data: existingVehicle } = await supabase
        .from('vehicle_information')
        .select('*')
        .eq('id', id)
        .single();

      if (existingVehicle) {
        const { error: vehicleError } = await supabase
          .from('vehicle_information')
          .update(vehicleUpdate)
          .eq('id', id);

        if (vehicleError) {
          throw new Error(`Failed to update vehicle info: ${vehicleError.message}`);
        }
      } else if (profile.vehicle_type) {
        const { error: vehicleError } = await supabase
          .from('vehicle_information')
          .insert([{
            id,
            vehicle_type: profile.vehicle_type,
            company: profile.vehicle_type.split(' ')[0] || 'Default',
            model: profile.vehicle_type,
            color: 'Default',
            registration_number: profile.vehicle_number || 'PENDING',
            seat_capacity: 4,
          }]);

        if (vehicleError) {
          throw new Error(`Failed to insert vehicle info: ${vehicleError.message}`);
        }
      }
    }

    const updated = await this.getUserProfile(id);
    if (!updated) {
      throw new Error('Failed to retrieve user profile after update.');
    }
    return updated;
  }
}
