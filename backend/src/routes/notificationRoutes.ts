import { Router, Response } from 'express';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth.js';
import { NotificationService } from '../services/notificationService.js';

const router = Router();

/**
 * @route   GET /api/notifications
 * @desc    Retrieves notifications log history for the authenticated user.
 */
router.get('/', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  const { id: userId } = req.user!;

  try {
    const list = await NotificationService.getNotifications(userId);
    return res.status(200).json({
      success: true,
      data: list,
    });
  } catch (error: any) {
    console.error('Fetch notifications failure:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve notifications.',
      error: error.message,
    });
  }
});

/**
 * @route   PATCH /api/notifications/:id/read
 * @desc    Marks a specific notification as read.
 */
router.patch('/:id/read', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  const { id: notificationId } = req.params;
  const { id: userId } = req.user!;

  try {
    const updated = await NotificationService.markAsRead(notificationId, userId);
    return res.status(200).json({
      success: true,
      message: 'Notification marked as read successfully.',
      data: updated,
    });
  } catch (error: any) {
    console.error('Mark notification read failure:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to update notification status.',
      error: error.message,
    });
  }
});

export default router;
