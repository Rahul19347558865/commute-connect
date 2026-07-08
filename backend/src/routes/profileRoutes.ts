import { Router, Response } from 'express';
import { z } from 'zod';
import multer from 'multer';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth.js';
import { ProfileService } from '../services/profileService.js';
import { UploadService } from '../services/uploadService.js';

const router = Router();

// Multer in-memory upload configurations (5MB limit)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

// Zod Validation Schemas
const vehicleSchema = z.object({
  vehicle_type: z.string().min(1, 'Vehicle type is required'),
  company: z.string().min(1, 'Company is required'),
  model: z.string().min(1, 'Model is required'),
  color: z.string().min(1, 'Color is required'),
  registration_number: z.string().min(1, 'Registration number is required'),
  seat_capacity: z.number().int().positive('Seat capacity must be positive'),
});

export const profileUpdateSchema = z
  .object({
    full_name: z.string().min(2, 'Full name is required (min 2 characters)'),
    role: z.enum(['driver', 'passenger', 'both', 'admin']),
    college_company: z.string().min(2, 'College or organization is required'),
    bio: z.string().nullable().optional(),
    gender: z.string().nullable().optional(),
    contact_number: z.string().nullable().optional(),
    emergency_contact: z.string().nullable().optional(),
    preferred_pickup_area: z.string().nullable().optional(),
    preferred_drop_area: z.string().nullable().optional(),
    travel_preferences: z.string().nullable().optional(),
    passenger_preferences: z.any().optional(),
    vehicle_information: vehicleSchema.optional(),
  })
  .refine(
    (data) => {
      // If role is driver or both, vehicle_information is required
      if ((data.role === 'driver' || data.role === 'both') && !data.vehicle_information) {
        return false;
      }
      return true;
    },
    {
      message: 'Vehicle information details are mandatory for driver roles.',
      path: ['vehicle_information'],
    }
  );

/**
 * @route   GET /api/profile/me
 * @desc    Retrieves current authenticated user complete profile with vehicle info.
 */
router.get('/me', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.user!;

  try {
    const profile = await ProfileService.getProfile(id);
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found in database. Registration required.',
        requiresRegistration: true,
      });
    }

    return res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error: any) {
    console.error('Fetch profile error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve profile record.',
      error: error.message,
    });
  }
});

/**
 * @route   PUT /api/profile
 * @desc    Creates or updates the profile record in database.
 */
router.put('/', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.user!;

  // 1. Zod request body validation
  const validationResult = profileUpdateSchema.safeParse(req.body);
  if (!validationResult.success) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed.',
      errors: validationResult.error.flatten().fieldErrors,
    });
  }

  const { vehicle_information, ...profileData } = validationResult.data;

  try {
    const updatedProfile = await ProfileService.upsertProfile(
      id,
      {
        full_name: profileData.full_name,
        role: profileData.role,
        college_company: profileData.college_company,
        bio: profileData.bio,
        gender: profileData.gender,
        contact_number: profileData.contact_number,
        emergency_contact: profileData.emergency_contact,
        preferred_pickup_area: profileData.preferred_pickup_area,
        preferred_drop_area: profileData.preferred_drop_area,
        travel_preferences: profileData.travel_preferences,
        passenger_preferences: profileData.passenger_preferences,
      },
      vehicle_information
    );

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      data: updatedProfile,
    });
  } catch (error: any) {
    console.error('Profile update error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to update profile record.',
      error: error.message,
    });
  }
});

/**
 * @route   POST /api/profile/avatar
 * @desc    Uploads profile picture and updates profiles photo fields.
 */
router.post(
  '/avatar',
  authMiddleware,
  upload.single('avatar'),
  async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.user!;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded. Please upload a valid image file under avatar field.',
      });
    }

    try {
      // 1. Upload stream buffer to Cloudinary
      const avatarUrl = await UploadService.uploadAvatar(req.file.buffer);

      // 2. Write URL to user profile
      await ProfileService.updateAvatar(id, avatarUrl);

      return res.status(200).json({
        success: true,
        message: 'Avatar uploaded successfully.',
        avatarUrl,
      });
    } catch (error: any) {
      console.error('Avatar upload error:', error.message);
      return res.status(500).json({
        success: false,
        message: 'Failed to upload and update avatar profile.',
        error: error.message,
      });
    }
  }
);

export default router;
