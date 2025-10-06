'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import ReviewStars from './ReviewStars';
import toast from 'react-hot-toast';

interface ReviewFormProps {
  productId: string;
  productName: string;
  onCancel: () => void;
  onSuccess: () => void;
}

export default function ReviewForm({ productId, productName, onCancel, onSuccess }: ReviewFormProps) {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please sign in to submit a review');
      return;
    }

    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    if (!title.trim()) {
      toast.error('Please enter a review title');
      return;
    }

    if (!comment.trim()) {
      toast.error('Please enter your review comment');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating,
          title: title.trim(),
          comment: comment.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Review submitted successfully!');
        onSuccess();
      } else {
        throw new Error(data.error || 'Failed to submit review');
      }
    } catch (error: any) {
      console.error('Review submission error:', error);
      toast.error(error.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = rating > 0 && title.trim().length > 0 && comment.trim().length > 0;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
      <h4 className="text-lg font-semibold text-gray-900 mb-4">Write a Review</h4>
      <p className="text-gray-600 mb-6">Share your thoughts about {productName}</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rating Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Overall Rating *
          </label>
          <div className="flex items-center space-x-2">
            <ReviewStars
              rating={rating} // This starts at 0, so all stars will be grey
              onChange={setRating}
              interactive={true}
              size="lg"
            />
            <span className="text-sm text-gray-500 ml-2">
              {rating > 0 ? `${rating} star${rating !== 1 ? 's' : ''}` : 'Select rating'}
            </span>
          </div>
        </div>

        {/* Review Title */}
        <div>
          <label htmlFor="review-title" className="block text-sm font-medium text-gray-700 mb-2">
            Review Title *
          </label>
          <input
            type="text"
            id="review-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Summarize your experience in a few words"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            maxLength={100}
          />
          <p className="text-xs text-gray-500 mt-1">
            {title.length}/100 characters
          </p>
        </div>

        {/* Review Comment */}
        <div>
          <label htmlFor="review-comment" className="block text-sm font-medium text-gray-700 mb-2">
            Your Review *
          </label>
          <textarea
            id="review-comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share details about your experience with this product..."
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
            maxLength={1000}
          />
          <p className="text-xs text-gray-500 mt-1">
            {comment.length}/1000 characters
          </p>
        </div>

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 font-semibold"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 font-semibold"
          >
            Cancel
          </button>
        </div>

        {/* Help Text */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-700">
            <strong>Review Guidelines:</strong> Please be honest and constructive in your review. 
            Avoid personal attacks, profanity, or promotional content. Your review will help other 
            customers make informed decisions.
          </p>
        </div>
      </form>
    </div>
  );
}