import { Router, Response } from 'express';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth.js';
import { TrustService } from '../services/trustService.js';
import { DashboardService } from '../services/dashboardService.js';

const router = Router();

/**
 * @route   GET /api/dashboard
 * @desc    Retrieves commuter stats, upcoming rides, and active trip sessions.
 */
router.get('/dashboard', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  const { id: userId } = req.user!;

  try {
    const stats = await DashboardService.getDashboardStats(userId);
    return res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error: any) {
    console.error('Fetch dashboard stats failure:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to compile dashboard metrics.',
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/history
 * @desc    Retrieves completed and cancelled ride history with pagination.
 */
router.get('/history', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  const { id: userId } = req.user!;
  const { page, limit } = req.query;

  try {
    const historyData = await DashboardService.getHistory(
      userId,
      page ? parseInt(page as string, 10) : 1,
      limit ? parseInt(limit as string, 10) : 10
    );
    return res.status(200).json({
      success: true,
      data: historyData,
    });
  } catch (error: any) {
    console.error('Fetch history failure:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve ride history.',
      error: error.message,
    });
  }
});

/**
 * @route   POST /api/reviews
 * @desc    Submits review comments and ratings score for a ride participant.
 */
router.post('/reviews', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  const { ride_id, reviewee_id, rating, comment } = req.body;
  const { id: reviewerId } = req.user!;

  if (!ride_id || !reviewee_id || !rating) {
    return res.status(400).json({
      success: false,
      message: 'ride_id, reviewee_id, and rating parameters are required.',
    });
  }

  try {
    const review = await TrustService.createReview(ride_id, reviewerId, reviewee_id, Number(rating), comment);
    return res.status(201).json({
      success: true,
      message: 'Review posted successfully.',
      data: review,
    });
  } catch (error: any) {
    console.error('Post review failure:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to submit review.',
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/reviews/:userId
 * @desc    Retrieves public reviews given to a user.
 */
router.get('/reviews/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const list = await TrustService.getReviewsForUser(userId);
    return res.status(200).json({
      success: true,
      data: list,
    });
  } catch (error: any) {
    console.error('Fetch reviews failure:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve reviews.',
      error: error.message,
    });
  }
});

/**
 * @route   POST /api/saved-places
 * @desc    Creates a saved place bookmark.
 */
router.post('/saved-places', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  const { label, address, latitude, longitude } = req.body;
  const { id: userId } = req.user!;

  if (!label || !address || latitude === undefined || longitude === undefined) {
    return res.status(400).json({
      success: false,
      message: 'label, address, latitude, and longitude parameters are required.',
    });
  }

  try {
    const place = await TrustService.createSavedPlace(userId, label, address, Number(latitude), Number(longitude));
    return res.status(201).json({
      success: true,
      message: 'Place saved successfully.',
      data: place,
    });
  } catch (error: any) {
    console.error('Create saved place failure:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to save location bookmark.',
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/saved-places
 * @desc    Lists saved places bookmarks for the authenticated user.
 */
router.get('/saved-places', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  const { id: userId } = req.user!;

  try {
    const list = await TrustService.getSavedPlaces(userId);
    return res.status(200).json({
      success: true,
      data: list,
    });
  } catch (error: any) {
    console.error('Fetch saved places failure:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve saved locations.',
      error: error.message,
    });
  }
});

/**
 * @route   DELETE /api/saved-places/:id
 * @desc    Deletes a saved place bookmark.
 */
router.delete('/saved-places/:id', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  const { id: placeId } = req.params;
  const { id: userId } = req.user!;

  try {
    await TrustService.deleteSavedPlace(placeId, userId);
    return res.status(200).json({
      success: true,
      message: 'Saved place bookmark deleted successfully.',
    });
  } catch (error: any) {
    console.error('Delete saved place failure:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete saved location bookmark.',
      error: error.message,
    });
  }
});

export default router;
