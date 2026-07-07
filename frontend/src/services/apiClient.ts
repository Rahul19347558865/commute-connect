import axios from 'axios';
import { supabase } from './supabase';

/**
 * Centered API Client wrapper configured with authorization request interceptors
 * and auto-signout response interceptors on session invalidations.
 */
export const apiClient = axios.create({
  baseURL: '',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach current active session token to headers
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
      }
    } catch (err) {
      console.error('API Client Auth token extraction failed:', err);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Catch 401 unauthenticated session updates
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Auto-terminate session on token invalidations
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.error('Signout on 401 token invalidation failed:', err);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
