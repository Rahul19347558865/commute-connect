import { Router, Response } from 'express';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth.js';
import { UserService } from '../services/userService.js';

const router = Router();

/**
 * @route   POST /api/auth/register
 * @desc    Registers profile details inside the public 'users' database table.
 *          Requires a valid Supabase JWT bearer token header.
 */
router.post('/register', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  const { id, email } = req.user!;
  const { full_name, role, college_company, bio, vehicle_type, vehicle_number } = req.body;

  // Validation
  if (!full_name || !role || !college_company) {
    return res.status(400).json({
      success: false,
      message: 'Missing required profile fields (full_name, role, college_company).',
    });
  }

  const validRoles = ['driver', 'passenger', 'both'];
  if (!validRoles.includes(role)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid role value. Must be driver, passenger, or both.',
    });
  }

  try {
    // Check if user profile already exists
    const existing = await UserService.getUserProfile(id);
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'Profile already registered in database.',
        data: existing,
      });
    }

    const newProfile = await UserService.createUserProfile({
      id,
      email: email || '',
      full_name,
      role: role as 'driver' | 'passenger' | 'both',
      college_company,
      bio,
      vehicle_type,
      vehicle_number,
    });

    return res.status(201).json({
      success: true,
      message: 'User profile registered successfully.',
      data: newProfile,
    });
  } catch (error: any) {
    console.error('Registration profile error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to complete database profile registration.',
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/auth/me
 * @desc    Retrieves current user database profile info.
 *          Requires a valid Supabase JWT bearer token header.
 */
router.get('/me', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.user!;

  try {
    const profile = await UserService.getUserProfile(id);
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found in database. Registration required.',
        requiresRegistration: true,
      });
    }

    return res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error: any) {
    console.error('Fetch me profile error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve profile data.',
      error: error.message,
    });
  }
});

/**
 * @route   POST /api/auth/logout
 * @desc    Logs out user session. Handled on client side natively.
 */
router.post('/logout', (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Logged out successfully.',
  });
});

export default router;
