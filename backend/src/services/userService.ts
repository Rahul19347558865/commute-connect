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
}

/**
 * Service class managing database operations on the public 'users' table.
 */
export class UserService {
  /**
   * Fetches user profile record by primary key UUID
   */
  static async getUserProfile(id: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Record not found
        return null;
      }
      throw new Error(`Failed to fetch user profile: ${error.message}`);
    }

    return data as UserProfile;
  }

  /**
   * Inserts a new user profile record
   */
  static async createUserProfile(profile: UserProfile): Promise<UserProfile> {
    const { data, error } = await supabase
      .from('users')
      .insert([profile])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create user profile: ${error.message}`);
    }

    return data as UserProfile;
  }

  /**
   * Updates an existing user profile record
   */
  static async updateUserProfile(id: string, profile: Partial<UserProfile>): Promise<UserProfile> {
    const { data, error } = await supabase
      .from('users')
      .update(profile)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update user profile: ${error.message}`);
    }

    return data as UserProfile;
  }
}
