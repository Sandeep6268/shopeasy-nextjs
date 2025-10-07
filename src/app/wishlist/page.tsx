'use client';

import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import ProductCard from '@/components/products/ProductCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function WishlistPage() {
  const { wishlist, isLoading } = useWishlist();
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">Please sign in to view your wishlist.</p>
          <Link
            href="/auth/signin"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-64">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Wishlist</h1>
        <p className="text-gray-600">
          {wishlist.length === 0 
            ? 'Your wishlist is empty' 
            : `You have ${wishlist.length} item${wishlist.length !== 1 ? 's' : ''} in your wishlist`
          }
        </p>
      </div>

      {wishlist.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <div className="text-gray-400 mb-4">
            <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h3>
          <p className="text-gray-600 mb-6">Start adding items you love to your wishlist!</p>
          <Link
            href="/products"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
          >
            Browse Products
          </Link>
        </div>
      )}
    </div>
  );
}