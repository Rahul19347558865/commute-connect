import { Router, Response } from 'express';
import { z } from 'zod';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth.js';
import { RideService } from '../services/rideService.js';
import { ProfileService } from '../services/profileService.js';
import { BookingService } from '../services/bookingService.js';

const router = Router();

// Zod Validation Schema for Ride Creation/Modification
export const rideSchema = z
  .object({
    pickup_location: z.string().min(2, 'Pickup address is required'),
    pickup_latitude: z.number().min(-90).max(90, 'Invalid latitude coordinates'),
    pickup_longitude: z.number().min(-180).max(180, 'Invalid longitude coordinates'),
    destination: z.string().min(2, 'Destination address is required'),
    destination_latitude: z.number().min(-90).max(90, 'Invalid latitude coordinates'),
    destination_longitude: z.number().min(-180).max(180, 'Invalid longitude coordinates'),
    departure_time: z.string().refine(
      (val) => new Date(val) > new Date(),
      { message: 'Departure time must be scheduled in the future.' }
    ),
    available_seats: z.number().int().positive('Must offer at least 1 seat'),
    contribution_type: z.enum(['free', 'paid', 'co-travel']),
    contribution_amount: z.number().nonnegative().optional().default(0),
    notes: z.string().nullable().optional(),
  })
  .refine(
    (data) => {
      if (data.contribution_type === 'paid' && (!data.contribution_amount || data.contribution_amount <= 0)) {
        return false;
      }
      return true;
    },
    {
      message: 'Paid rides require a contribution amount greater than zero.',
      path: ['contribution_amount'],
    }
  );

/**
 * @route   POST /api/rides
 * @desc    Creates a new ride offering. Requires Driver/Both role validation.
 */
router.post('/', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.user!;

  // 1. Enforce Role and Profile Presence Checks
  try {
    const profile = await ProfileService.getProfile(id);
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found. Onboarding profile is required to offer rides.',
      });
    }
    if (profile.role !== 'driver' && profile.role !== 'both') {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Only users registered as drivers may offer rides.',
      });
    }

    // 2. Validate Request Body
    const validationResult = rideSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed.',
        errors: validationResult.error.flatten().fieldErrors,
      });
    }

    const newRide = await RideService.createRide(id, validationResult.data);
    return res.status(201).json({
      success: true,
      message: 'Ride offering published successfully.',
      data: newRide,
    });
  } catch (error: any) {
    console.error('Ride creation failure:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to publish ride offering.',
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/rides
 * @desc    Lists active rides with optional search filters.
 */
router.get('/', async (req, res) => {
  const { pickup, destination, date, seats, contribution_type, status, vehicle_type, sortBy, page, limit } = req.query;

  try {
    const rides = await RideService.listRides({
      pickup: pickup as string,
      destination: destination as string,
      date: date as string,
      seats: seats ? parseInt(seats as string, 10) : undefined,
      contribution_type: contribution_type as string,
      status: status as 'active' | 'completed' | 'cancelled',
      vehicle_type: vehicle_type as string,
      sortBy: sortBy as string,
      page: page ? parseInt(page as string, 10) : undefined,
      limit: limit ? parseInt(limit as string, 10) : undefined,
    });

    return res.status(200).json({
      success: true,
      data: rides,
    });
  } catch (error: any) {
    console.error('List rides failure:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve rides.',
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/rides/requests/passenger
 * @desc    Retrieves passenger's request/booking history.
 */
router.get('/requests/passenger', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  const { id: passengerId } = req.user!;

  try {
    const history = await BookingService.getUserRequests(passengerId);
    return res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error: any) {
    console.error('Fetch passenger history error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve bookings history.',
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/rides/:id
 * @desc    Fetches single ride by ID.
 */
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const ride = await RideService.getRideById(id);
    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Ride offering not found.',
      });
    }

    return res.status(200).json({
      success: true,
      data: ride,
    });
  } catch (error: any) {
    console.error('Fetch ride details failure:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch ride details.',
      error: error.message,
    });
  }
});

/**
 * @route   PUT /api/rides/:id
 * @desc    Updates ride details. Only the ride owner may modify.
 */
router.put('/:id', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  const { id: rideId } = req.params;
  const { id: driverId } = req.user!;

  // 1. Zod Request Verification
  const validationResult = rideSchema.safeParse(req.body);
  if (!validationResult.success) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed.',
      errors: validationResult.error.flatten().fieldErrors,
    });
  }

  try {
    const updatedRide = await RideService.updateRide(rideId, driverId, validationResult.data);
    if (!updatedRide) {
      return res.status(404).json({
        success: false,
        message: 'Ride offering not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Ride details updated successfully.',
      data: updatedRide,
    });
  } catch (error: any) {
    console.error('Update ride failure:', error.message);
    const isAccessDenied = error.message.includes('Access denied');
    return res.status(isAccessDenied ? 403 : 500).json({
      success: false,
      message: error.message || 'Failed to update ride details.',
    });
  }
});

/**
 * @route   DELETE /api/rides/:id
 * @desc    Deletes (cancels) a ride. Only the ride owner may delete.
 */
router.delete('/:id', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  const { id: rideId } = req.params;
  const { id: driverId } = req.user!;

  try {
    const deleted = await RideService.deleteRide(rideId, driverId);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Ride offering not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Ride offering deleted successfully.',
    });
  } catch (error: any) {
    console.error('Delete ride failure:', error.message);
    const isAccessDenied = error.message.includes('Access denied');
    return res.status(isAccessDenied ? 403 : 500).json({
      success: false,
      message: error.message || 'Failed to delete ride offering.',
    });
  }
});

// ==========================================
// BOOKING REQUESTS ENDPOINTS
// ==========================================

/**
 * @route   POST /api/rides/:id/request
 * @desc    Submit booking request on a ride.
 */
router.post('/:id/request', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  const { id: rideId } = req.params;
  const { id: passengerId } = req.user!;

  try {
    const request = await BookingService.createRequest(rideId, passengerId);
    return res.status(201).json({
      success: true,
      message: 'Booking request submitted successfully.',
      data: request,
    });
  } catch (error: any) {
    console.error('Create request error:', error.message);
    const isDeny = error.message.includes('Access denied') || error.message.includes('failed') || error.message.includes('remaining');
    return res.status(isDeny ? 400 : 500).json({
      success: false,
      message: error.message || 'Failed to submit booking request.',
    });
  }
});

/**
 * @route   GET /api/rides/:id/requests
 * @desc    Lists booking requests for a specific ride offering (driver only).
 */
router.get('/:id/requests', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  const { id: rideId } = req.params;
  const { id: driverId } = req.user!;

  try {
    const requests = await BookingService.getRequestsForRide(rideId, driverId);
    return res.status(200).json({
      success: true,
      data: requests,
    });
  } catch (error: any) {
    console.error('Fetch requests error:', error.message);
    const isDeny = error.message.includes('Access denied');
    return res.status(isDeny ? 403 : 500).json({
      success: false,
      message: error.message || 'Failed to retrieve booking requests.',
    });
  }
});



/**
 * @route   PATCH /api/rides/requests/:requestId
 * @desc    Updates booking status (driver approves/rejects, or passenger cancels).
 */
router.patch('/requests/:requestId', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  const { requestId } = req.params;
  const { status } = req.body; // 'accepted', 'rejected', 'cancelled'
  const { id: userId } = req.user!;

  if (!status || !['accepted', 'rejected', 'cancelled'].includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid status update target.',
    });
  }

  try {
    const updated = await BookingService.updateRequestStatus(requestId, userId, status);
    return res.status(200).json({
      success: true,
      message: `Booking status updated to ${status} successfully.`,
      data: updated,
    });
  } catch (error: any) {
    console.error('Update request status error:', error.message);
    const isDeny = error.message.includes('Access denied') || error.message.includes('filled');
    return res.status(isDeny ? 403 : 500).json({
      success: false,
      message: error.message || 'Failed to update booking status.',
    });
  }
});

/**
 * @route   DELETE /api/rides/requests/:requestId
 * @desc    Deletes/cancels request (equivalent to cancelling request).
 */
router.delete('/requests/:requestId', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  const { requestId } = req.params;
  const { id: userId } = req.user!;

  try {
    // Treat deletion as cancellation to restore seats if accepted
    await BookingService.updateRequestStatus(requestId, userId, 'cancelled');
    return res.status(200).json({
      success: true,
      message: 'Booking request cancelled and deleted successfully.',
    });
  } catch (error: any) {
    console.error('Delete request error:', error.message);
    const isDeny = error.message.includes('Access denied');
    return res.status(isDeny ? 403 : 500).json({
      success: false,
      message: error.message || 'Failed to cancel booking request.',
    });
  }
});

export default router;
