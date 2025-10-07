// components/reviews/ReviewsSection.tsx - UPDATED WITH IMMEDIATE REFRESH
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import ReviewStars from './ReviewStars';

interface Review {
  _id: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  helpful: number;
  notHelpful: number;
  createdAt: string;
}

interface ReviewsSectionProps {
  productId: string;
  productName: string;
  initialRating?: number;
  initialReviewCount?: number;
}

export default function ReviewsSection({ 
  productId, 
  productName, 
  initialRating = 0, 
  initialReviewCount = 0 
}: ReviewsSectionProps) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(initialRating);
  const [totalReviews, setTotalReviews] = useState(initialReviewCount);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 0,
    title: '',
    comment: ''
  });

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/products/${productId}/reviews`);
      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews || []);
        setAverageRating(data.summary?.averageRating || 0);
        setTotalReviews(data.summary?.totalReviews || 0);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to submit a review');
      return;
    }

    if (!reviewForm.rating || !reviewForm.title.trim() || !reviewForm.comment.trim()) {
      toast.error('Please provide rating, title, and comment');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating: reviewForm.rating,
          title: reviewForm.title.trim(),
          comment: reviewForm.comment.trim()
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Review submitted successfully!');
        setReviewForm({ rating: 0, title: '', comment: '' });
        
        // ✅ IMMEDIATE PAGE REFRESH
        window.location.reload();
        
      } else {
        throw new Error(data.error || 'Failed to submit review');
      }
    } catch (error: any) {
      console.error('Submit review error:', error);
      toast.error(error.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
      </div>
    );
  }

  return (
    <div className="border-t pt-8">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h3>

      {/* Rating Summary */}
      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900">{averageRating.toFixed(1)}</div>
            <div className="flex items-center justify-center mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`w-5 h-5 ${
                    star <= Math.floor(averageRating)
                      ? 'text-yellow-400'
                      : 'text-gray-300'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              {totalReviews} review{totalReviews !== 1 ? 's' : ''}
            </div>
          </div>
          <div className="flex-1">
            <p className="text-gray-600">
              Share your experience with {productName}
            </p>
          </div>
        </div>
      </div>

      {/* Review Form */}
      {user && (
        <div className="bg-white border rounded-lg p-6 mb-8">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Write a Review</h4>
          <form onSubmit={handleSubmitReview}>
            // Review Form section - Replace the current stars with this
        // ReviewsSection.tsx mein stars section replace karein
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Rating
            </label>
            <ReviewStars
              rating={reviewForm.rating}
              onChange={(newRating) => setReviewForm(prev => ({ ...prev, rating: newRating }))}
              interactive={true}
              size="lg"
            />
            {reviewForm.rating > 0 && (
              <p className="text-sm text-gray-600 mt-1">
                You selected: {reviewForm.rating} star{reviewForm.rating !== 1 ? 's' : ''}
              </p>
            )}
          </div>
            
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Review Title
              </label>
              <input
                type="text"
                id="title"
                value={reviewForm.title}
                onChange={(e) => setReviewForm(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Summarize your experience..."
                maxLength={100}
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                Your Review
              </label>
              <textarea
                id="comment"
                rows={4}
                value={reviewForm.comment}
                onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Share your detailed experience with this product..."
                maxLength={1000}
              />
              <div className="text-sm text-gray-500 mt-1">
                {reviewForm.comment.length}/1000 characters
              </div>
            </div>
            
            <button
              type="submit"
              disabled={submitting || !reviewForm.rating || !reviewForm.title.trim() || !reviewForm.comment.trim()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review._id} className="border-b pb-6 last:border-0">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h5 className="font-semibold text-gray-900">{review.title}</h5>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className={`w-4 h-4 ${
                            star <= review.rating
                              ? 'text-yellow-400'
                              : 'text-gray-300'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">by {review.userName}</span>
                    {review.verifiedPurchase && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Verified Purchase
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-sm text-gray-500">
                  {formatDate(review.createdAt)}
                </span>
              </div>
              <p className="text-gray-700 mt-2">{review.comment}</p>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
          </div>
        )}
      </div>
    </div>
  );
}