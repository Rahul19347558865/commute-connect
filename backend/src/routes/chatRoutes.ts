import { Router, Response } from 'express';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth.js';
import { ChatService } from '../services/chatService.js';

const router = Router();

/**
 * @route   GET /api/chat/:rideId/messages
 * @desc    Retrieves chronological chat log messages for a ride offering (participants only).
 */
router.get('/:rideId/messages', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  const { rideId } = req.params;
  const { id: callerId } = req.user!;

  try {
    const messages = await ChatService.getMessages(rideId, callerId);
    return res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error: any) {
    console.error('Fetch messages failure:', error.message);
    const isDeny = error.message.includes('Access denied');
    return res.status(isDeny ? 403 : 500).json({
      success: false,
      message: error.message || 'Failed to retrieve chat messages.',
    });
  }
});

/**
 * @route   POST /api/chat/:rideId/message
 * @desc    Publishes a new message on the ride's conversation channel.
 */
router.post('/:rideId/message', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  const { rideId } = req.params;
  const { message_text } = req.body;
  const { id: senderId } = req.user!;

  if (!message_text || message_text.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Message text cannot be empty.',
    });
  }

  try {
    const message = await ChatService.sendMessage(rideId, senderId, message_text);
    return res.status(201).json({
      success: true,
      message: 'Message published successfully.',
      data: message,
    });
  } catch (error: any) {
    console.error('Send message failure:', error.message);
    const isDeny = error.message.includes('Access denied');
    return res.status(isDeny ? 403 : 500).json({
      success: false,
      message: error.message || 'Failed to post chat message.',
    });
  }
});

export default router;
