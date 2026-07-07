import axios from 'axios';
import { supabase } from './supabase';

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
 * Helper to retrieve the current active Supabase session JWT token and configure headers.
 */
async function getAuthHeaders() {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    },
  };
}

/**
 * AuthService - Front-end service layer communicating with Supabase Auth and backend profile endpoints.
 */
export class AuthService {
  /**
   * Syncs/registers user profile metadata in public database.
   */
  static async registerProfile(profileData: Omit<UserProfile, 'id' | 'email'>): Promise<UserProfile> {
    const headers = await getAuthHeaders();
    const response = await axios.post(`${API_BASE}/register`, profileData, headers);
    return response.data.data;
  }

  /**
   * Fetches active user database profile info.
   */
  static async getProfile(): Promise<UserProfile> {
    const headers = await getAuthHeaders();
    const response = await axios.get(`${API_BASE}/me`, headers);
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
