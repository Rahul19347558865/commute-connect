import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase.js';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email?: string;
    role?: string;
  };
}

/**
 * Authentication middleware that verifies the user session token using the Supabase Server SDK.
 * This avoids dependency on the SUPABASE_JWT_SECRET.
 */
export async function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. Authentication token missing or invalid format.',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid, expired, or revoked authentication session.',
        error: error?.message,
      });
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    
    return next();
  } catch (error) {
    console.error('Auth verification error:', error);
    return res.status(401).json({
      success: false,
      message: 'Authentication check failed.',
    });
  }
}
