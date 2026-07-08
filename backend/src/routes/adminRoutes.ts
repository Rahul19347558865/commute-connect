import { Router, Response } from 'express';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth.js';
import { adminMiddleware } from '../middleware/admin.js';
import { AdminService } from '../services/adminService.js';
import { supabase } from '../config/supabase.js';

const router = Router();

// ==========================================
// USER REPORTING ENDPOINT (Authenticated)
// ==========================================

/**
 * @route   POST /api/reports
 * @desc    Submit a moderation report for a user, ride, or review.
 */
router.post('/reports', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  const { reported_user_id, reported_ride_id, reported_review_id, reason } = req.body;
  const { id: reporterId } = req.user!;

  if (!reason || reason.trim() === '') {
    return res.status(400).json({ success: false, message: 'Reason text is required.' });
  }

  try {
    const { data, error } = await supabase
      .from('reports')
      .insert({
        reporter_id: reporterId,
        reported_user_id: reported_user_id || null,
        reported_ride_id: reported_ride_id || null,
        reported_review_id: reported_review_id || null,
        reason,
        status: 'pending',
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    return res.status(201).json({
      success: true,
      message: 'Report submitted successfully. Administrators will review this shortly.',
      data,
    });
  } catch (error: any) {
    console.error('Create report failure:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to submit report.',
      error: error.message,
    });
  }
});

// ==========================================
// ADMIN DASHBOARD & LISTING ENDPOINTS (Admin Only)
// ==========================================

/**
 * @route   GET /api/admin/dashboard
 * @desc    Retrieves platform statistics overview.
 */
router.get('/admin/dashboard', authMiddleware, adminMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const stats = await AdminService.getDashboardStats();
    return res.status(200).json({ success: true, data: stats });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   GET /api/admin/users
 * @desc    Lists all users.
 */
router.get('/admin/users', authMiddleware, adminMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const list = await AdminService.getUsers();
    return res.status(200).json({ success: true, data: list });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   GET /api/admin/rides
 * @desc    Lists all rides.
 */
router.get('/admin/rides', authMiddleware, adminMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const list = await AdminService.getRides();
    return res.status(200).json({ success: true, data: list });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   GET /api/admin/bookings
 * @desc    Lists all bookings.
 */
router.get('/admin/bookings', authMiddleware, adminMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const list = await AdminService.getBookings();
    return res.status(200).json({ success: true, data: list });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   GET /api/admin/reports
 * @desc    Lists all moderation reports.
 */
router.get('/admin/reports', authMiddleware, adminMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const list = await AdminService.getReports();
    return res.status(200).json({ success: true, data: list });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// ADMIN MODERATION ACTIONS (Admin Only)
// ==========================================

/**
 * @route   PATCH /api/admin/reports/:id
 * @desc    Resolves or dismisses a report.
 */
router.patch('/admin/reports/:id', authMiddleware, adminMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { status } = req.body; // 'resolved', 'dismissed'

  if (!status || !['resolved', 'dismissed'].includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid resolution status.' });
  }

  try {
    const resolved = await AdminService.resolveReport(id, status);
    return res.status(200).json({ success: true, message: 'Report status updated.', data: resolved });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   PATCH /api/admin/users/:id/suspend
 * @desc    Suspends a user account.
 */
router.patch('/admin/users/:id/suspend', authMiddleware, adminMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  try {
    const userProfile = await AdminService.suspendUser(id);
    return res.status(200).json({ success: true, message: 'User suspended successfully.', data: userProfile });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   PATCH /api/admin/users/:id/restore
 * @desc    Restores a suspended user account.
 */
router.patch('/admin/users/:id/restore', authMiddleware, adminMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  try {
    const userProfile = await AdminService.restoreUser(id);
    return res.status(200).json({ success: true, message: 'User restored successfully.', data: userProfile });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   DELETE /api/admin/reviews/:id
 * @desc    Deletes an inappropriate review.
 */
router.delete('/admin/reviews/:id', authMiddleware, adminMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  try {
    await AdminService.deleteReview(id);
    return res.status(200).json({ success: true, message: 'Review deleted successfully.' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   PATCH /api/admin/rides/:id/archive
 * @desc    Archives/cancels a ride offering.
 */
router.patch('/admin/rides/:id/archive', authMiddleware, adminMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  try {
    const ride = await AdminService.archiveRide(id);
    return res.status(200).json({ success: true, message: 'Ride archived successfully.', data: ride });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
