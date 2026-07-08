import React, { useState } from 'react';
import { useAddReview } from '../../hooks/useTrust';
import { useToast } from '../../hooks/useToast';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import { Star } from '../icons';

interface ReviewModalProps {
  rideId: string;
  revieweeId: string;
  revieweeName: string;
  onClose: () => void;
}

/**
 * ReviewModal - Overlay modal enabling passengers and drivers to grade
 * commute behavior using stars rating and review text comments.
 */
export const ReviewModal: React.FC<ReviewModalProps> = ({
  rideId,
  revieweeId,
  revieweeName,
  onClose,
}) => {
  const { toast } = useToast();
  const { mutateAsync: postReview, isPending } = useAddReview();

  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await postReview({
        ride_id: rideId,
        reviewee_id: revieweeId,
        rating,
        comment,
      });
      toast('success', 'Thank you! Your feedback has been published.');
      onClose();
    } catch (err: any) {
      toast('error', err.response?.data?.message || err.message || 'Failed to submit review.');
    }
  };

  return (
    <div className="fixed inset-0 z-layer-modal flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <Card className="w-full max-w-md border border-neutral-borderLine dark:border-slate-800 shadow-shadow-large bg-neutral-surface dark:bg-slate-900 animate-slide-up">
        <CardHeader>
          <CardTitle>Submit Review</CardTitle>
          <p className="text-tiny text-neutral-textSub dark:text-slate-400 mt-1">
            Rate your experience with <span className="font-bold text-neutral-textMain dark:text-slate-200">{revieweeName}</span>.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Star Rating Selectors */}
            <div className="flex flex-col items-center gap-2 py-2">
              <span className="text-[10px] font-bold text-neutral-textSub uppercase tracking-wider">Score</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 outline-none focus-visible:ring-1 focus-visible:ring-brand-primary rounded"
                  >
                    <Star
                      className={`w-8 h-8 cursor-pointer transition-colors duration-theme-fast
                        ${star <= rating ? 'text-amber-500 fill-amber-500' : 'text-slate-300 dark:text-slate-700'}
                      `}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Comment Inputs */}
            <Textarea
              label="Share your feedback"
              placeholder="e.g. Friendly driving, arrived on-time, great conversation..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
            />

            {/* Actions */}
            <div className="flex gap-3 justify-end pt-2">
              <Button type="button" variant="secondary" size="sm" onClick={onClose} disabled={isPending}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" loading={isPending}>
                Submit Feedback
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
export default ReviewModal;
