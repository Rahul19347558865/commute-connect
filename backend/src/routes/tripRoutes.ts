import { Router, Response } from 'express';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth.js';
import { TripService } from '../services/tripService.js';

const router = Router();

/**
 * @route   POST /api/trips/start
 * @desc    Begins a trip session (driver only).
 */
router.post('/trips/start', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  const { rideId } = req.body;
  const { id: driverId } = req.user!;

  if (!rideId) {
    return res.status(400).json({ success: false, message: 'rideId is required.' });
  }

  try {
    const session = await TripService.startTrip(rideId, driverId);
    return res.status(200).json({
      success: true,
      message: 'Trip started successfully.',
      data: session,
    });
  } catch (error: any) {
    console.error('Start trip failure:', error.message);
    const isDeny = error.message.includes('Access denied');
    return res.status(isDeny ? 403 : 500).json({
      success: false,
      message: error.message || 'Failed to start trip.',
    });
  }
});

/**
 * @route   POST /api/trips/end
 * @desc    Ends an active trip session (driver only).
 */
router.post('/trips/end', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  const { rideId } = req.body;
  const { id: driverId } = req.user!;

  if (!rideId) {
    return res.status(400).json({ success: false, message: 'rideId is required.' });
  }

  try {
    const session = await TripService.endTrip(rideId, driverId);
    return res.status(200).json({
      success: true,
      message: 'Trip completed successfully.',
      data: session,
    });
  } catch (error: any) {
    console.error('End trip failure:', error.message);
    const isDeny = error.message.includes('Access denied');
    return res.status(isDeny ? 403 : 500).json({
      success: false,
      message: error.message || 'Failed to end trip.',
    });
  }
});

/**
 * @route   POST /api/location/update
 * @desc    Updates driver's current coordinates (driver only).
 */
router.post('/location/update', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  const { rideId, latitude, longitude } = req.body;
  const { id: driverId } = req.user!;

  if (!rideId || latitude === undefined || longitude === undefined) {
    return res.status(400).json({
      success: false,
      message: 'rideId, latitude, and longitude parameters are required.',
    });
  }

  try {
    const location = await TripService.updateLocation(rideId, driverId, Number(latitude), Number(longitude));
    return res.status(200).json({
      success: true,
      message: 'Location telemetry updated.',
      data: location,
    });
  } catch (error: any) {
    console.error('Location update failure:', error.message);
    const isDeny = error.message.includes('Access denied');
    return res.status(isDeny ? 403 : 500).json({
      success: false,
      message: error.message || 'Failed to update location telemetry.',
    });
  }
});

/**
 * @route   GET /api/location/:rideId
 * @desc    Retrieves driver's last coordinates (ride participants only).
 */
router.get('/location/:rideId', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  const { rideId } = req.params;
  const { id: callerId } = req.user!;

  try {
    const location = await TripService.getLocation(rideId, callerId);
    return res.status(200).json({
      success: true,
      data: location,
    });
  } catch (error: any) {
    console.error('Fetch location failure:', error.message);
    const isDeny = error.message.includes('Access denied');
    return res.status(isDeny ? 403 : 500).json({
      success: false,
      message: error.message || 'Failed to fetch location.',
    });
  }
});

/**
 * @route   GET /api/trips/session/:rideId
 * @desc    Retrieves active trip session status.
 */
router.get('/trips/session/:rideId', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  const { rideId } = req.params;
  const { id: callerId } = req.user!;

  try {
    const session = await TripService.getTripSession(rideId, callerId);
    return res.status(200).json({
      success: true,
      data: session,
    });
  } catch (error: any) {
    console.error('Fetch trip session failure:', error.message);
    const isDeny = error.message.includes('Access denied');
    return res.status(isDeny ? 403 : 500).json({
      success: false,
      message: error.message || 'Failed to retrieve trip session details.',
    });
  }
});

export default router;
