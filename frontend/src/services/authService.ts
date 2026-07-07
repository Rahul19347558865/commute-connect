import { apiClient } from './apiClient';

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

// Vite proxy resolves '/api' queries to http://localhost:5000/api
const API_BASE = '/api/auth';

/**
 * AuthService - Front-end service layer communicating with Supabase Auth and backend profile endpoints.
 */
export class AuthService {
  /**
   * Syncs/registers user profile metadata in public database.
   */
  static async registerProfile(profileData: Omit<UserProfile, 'id' | 'email'>): Promise<UserProfile> {
    const response = await apiClient.post(`${API_BASE}/register`, profileData);
    return response.data.data;
  }

  /**
   * Fetches active user database profile info.
   */
  static async getProfile(): Promise<UserProfile> {
    const response = await apiClient.get(`${API_BASE}/me`);
    return response.data.data;
  }

  /**
   * Checks if user profile exists in public database.
   */
  static async checkProfileExists(): Promise<boolean> {
    try {
      await this.getProfile();
      return true;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return false;
      }
      throw error;
    }
  }
}
