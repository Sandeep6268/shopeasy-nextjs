import ReviewStars from './ReviewStars';

interface Review {
  _id: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  helpful: number;
  notHelpful: number;
  createdAt: string;
}

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-semibold text-gray-900 mb-1">{review.title}</h4>
          <ReviewStars rating={review.rating} size="sm" showNumber />
        </div>
        <span className="text-sm text-gray-500">
          {formatDate(review.createdAt)}
        </span>
      </div>

      <div className="flex items-center space-x-2 mb-3">
        <span className="text-sm font-medium text-gray-900">
          {review.userName}
        </span>
        {review.verifiedPurchase && (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
            Verified Purchase
          </span>
        )}
      </div>

      <p className="text-gray-700 mb-4 leading-relaxed">{review.comment}</p>

      <div className="flex items-center space-x-4 text-sm text-gray-500">
        <button className="flex items-center space-x-1 hover:text-gray-700 transition-colors">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
          </svg>
          <span>Helpful ({review.helpful})</span>
        </button>
        <button className="flex items-center space-x-1 hover:text-gray-700 transition-colors">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018c.163 0 .326.02.485.06L17 4m-7 10v5a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2m-7 10h2a2 2 0 002-2v-6a2 2 0 00-2-2H5z" />
          </svg>
          <span>Not Helpful ({review.notHelpful})</span>
        </button>
      </div>
    </div>
  );
}