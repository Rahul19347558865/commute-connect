import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth.js';
import { supabase } from '../config/supabase.js';

/**
 * adminMiddleware - Asserts if the authenticated user carries the administrator
 * role in the database profiles table.
 */
export async function adminMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user || !req.user.id) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. Authentication session missing.',
    });
  }

  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', req.user.id)
      .single();

    if (error || !profile || profile.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Requires administrator permissions.',
      });
    }

    return next();
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: 'Admin authorization checks failed.',
      error: err.message,
    });
  }
}
