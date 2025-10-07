// components/WishlistButton.tsx - UPDATED
'use client';

import { useState } from 'react';
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { Product } from '@/types';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

interface WishlistButtonProps {
  product: Product;
  size?: 'sm' | 'md' | 'lg';
}

export default function WishlistButton({ product, size = 'md' }: WishlistButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { user } = useAuth();

  const sizeClasses = {
    sm: 'h-5 w-5',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  const isWishlisted = isInWishlist(product.id);

  const handleClick = async () => {
    if (!user) {
      toast.error('Please login to manage your wishlist');
      return;
    }

    setIsLoading(true);
    const action = isWishlisted ? 'removing from' : 'adding to';
    const wishlistToast = toast.loading(`${action.charAt(0).toUpperCase() + action.slice(1)} wishlist...`);

    try {
      if (isWishlisted) {
        await removeFromWishlist(product.id);
        toast.success('Removed from wishlist', { id: wishlistToast });
      } else {
        await addToWishlist(product);
        toast.success('Added to wishlist', { id: wishlistToast });
      }
    } catch (error) {
      console.error('Wishlist error:', error);
      toast.error('Failed to update wishlist', { id: wishlistToast });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`p-2 rounded-full transition-all duration-200 ${
        isWishlisted 
          ? 'text-red-500 bg-red-50 hover:bg-red-100' 
          : 'text-gray-400 bg-white hover:bg-gray-50 hover:text-red-400'
      } border border-gray-200 hover:border-red-200 disabled:opacity-50`}
      title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      {isWishlisted ? (
        <HeartSolid className={sizeClasses[size]} />
      ) : (
        <HeartOutline className={sizeClasses[size]} />
      )}
    </button>
  );
}

