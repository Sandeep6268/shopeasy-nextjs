// components/reviews/ReviewsSection.tsx - UPDATED WITH REAL-TIME SYNC
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

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
  onReviewSubmitted?: (newRating: number, newReviewCount: number) => void;
}

export default function ReviewsSection({ 
  productId, 
  productName, 
  initialRating = 0, 
  initialReviewCount = 0,
  onReviewSubmitted 
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
        
        // ✅ IMMEDIATELY update the UI without waiting for refetch
        const newReview: Review = {
          _id: data.review._id,
          userId: data.review.userId,
          userName: data.review.userName,
          rating: data.review.rating,
          title: data.review.title,
          comment: data.review.comment,
          verifiedPurchase: data.review.verifiedPurchase,
          helpful: 0,
          notHelpful: 0,
          createdAt: data.review.createdAt
        };

        // Add new review to the beginning of the list
        setReviews(prev => [newReview, ...prev]);
        
        // Update rating and count immediately
        const newRating = data.updatedProduct.rating;
        const newReviewCount = data.updatedProduct.reviewCount;
        
        setAverageRating(newRating);
        setTotalReviews(newReviewCount);

        // ✅ Call the callback function to update parent component
        if (onReviewSubmitted) {
          onReviewSubmitted(newRating, newReviewCount);
        }

        // ✅ Dispatch custom event for real-time updates across components
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('reviewSubmitted', {
            detail: {
              productId,
              newRating: newRating,
              newReviewCount: newReviewCount
            }
          }));
        }

        // ✅ Trigger database sync for ratings
        await syncProductRatings();

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

  const syncProductRatings = async () => {
    try {
      // Call the sync API to ensure database is updated
      await fetch('/api/sync-ratings', {
        method: 'GET'
      });
    } catch (error) {
      console.error('Error syncing ratings:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const StarRating = ({ rating, size = 'md' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) => {
    const starSize = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6'
    };

    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`${starSize[size]} ${
              star <= Math.floor(rating)
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
    );
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="border-b pb-4">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="border-t pt-8">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h3>

      {/* Rating Summary */}
      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900">{averageRating.toFixed(1)}</div>
            <StarRating rating={averageRating} size="lg" />
            <div className="text-sm text-gray-600 mt-1">
              {totalReviews} review{totalReviews !== 1 ? 's' : ''}
            </div>
          </div>
          <div className="flex-1">
            <p className="text-gray-600 mb-2">
              Share your experience with {productName}
            </p>
            {!user && (
              <p className="text-sm text-blue-600">
                Please login to write a review
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Review Form */}
      {user && (
        <div className="bg-white border rounded-lg p-6 mb-8">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Write a Review</h4>
          <form onSubmit={handleSubmitReview}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Rating *
              </label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                    className={`text-2xl focus:outline-none transition-transform hover:scale-110 ${
                      star <= reviewForm.rating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  >
                    ⭐
                  </button>
                ))}
              </div>
              {reviewForm.rating > 0 && (
                <p className="text-sm text-gray-600 mt-1">
                  You selected: {reviewForm.rating} star{reviewForm.rating !== 1 ? 's' : ''}
                </p>
              )}
            </div>
            
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Review Title *
              </label>
              <input
                type="text"
                id="title"
                value={reviewForm.title}
                onChange={(e) => setReviewForm(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Summarize your experience..."
                maxLength={100}
                required
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                Your Review *
              </label>
              <textarea
                id="comment"
                rows={4}
                value={reviewForm.comment}
                onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Share your detailed experience with this product..."
                maxLength={1000}
                required
              />
              <div className="text-sm text-gray-500 mt-1">
                {reviewForm.comment.length}/1000 characters
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                type="submit"
                disabled={submitting || !reviewForm.rating || !reviewForm.title.trim() || !reviewForm.comment.trim()}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {submitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  'Submit Review'
                )}
              </button>
              
              <button
                type="button"
                onClick={() => setReviewForm({ rating: 0, title: '', comment: '' })}
                className="px-4 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200"
              >
                Clear
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-8">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review._id} className="border-b border-gray-200 pb-8 last:border-0">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3">
                <div className="flex-1">
                  <h5 className="font-semibold text-gray-900 text-lg mb-2">{review.title}</h5>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <StarRating rating={review.rating} size="sm" />
                    <span className="text-sm text-gray-600">by {review.userName}</span>
                    {review.verifiedPurchase && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        ✓ Verified Purchase
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-sm text-gray-500 mt-2 sm:mt-0">
                  {formatDate(review.createdAt)}
                </span>
              </div>
              <p className="text-gray-700 leading-relaxed">{review.comment}</p>
              
              {/* Helpful Actions */}
              <div className="flex items-center space-x-4 mt-4 pt-4 border-t border-gray-100">
                <button className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                  </svg>
                  <span>Helpful ({review.helpful || 0})</span>
                </button>
                <button className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018c.163 0 .326.02.485.06L17 4m-7 10v5a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2m-7 0h2" />
                  </svg>
                  <span>Not Helpful ({review.notHelpful || 0})</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">No Reviews Yet</h4>
            <p className="text-gray-600 mb-6">Be the first to share your thoughts about this product!</p>
            {!user && (
              <p className="text-sm text-blue-600">
                Login to write the first review
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}