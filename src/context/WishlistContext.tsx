'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Product } from '@/types';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

interface WishlistContextType {
  wishlist: Product[];
  addToWishlist: (product: Product) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  isLoading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Load wishlist when user changes
  useEffect(() => {
    if (user) {
      loadWishlist();
    } else {
      setWishlist([]);
      setIsLoading(false);
    }
  }, [user]);

  const loadWishlist = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const response = await fetch('/api/wishlist');
      if (response.ok) {
        const data = await response.json();
        setWishlist(data.wishlist || []);
      } else {
        console.error('Failed to load wishlist');
      }
    } catch (error) {
      console.error('Failed to load wishlist:', error);
      toast.error('Failed to load wishlist');
    } finally {
      setIsLoading(false);
    }
  };

  const addToWishlist = async (product: Product) => {
    if (!user) {
      toast.error('Please login to add items to wishlist');
      return;
    }

    try {
      const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId: product.id }),
      });

      const data = await response.json();

      if (response.ok) {
        setWishlist(prev => [...prev, product]);
        toast.success('Added to wishlist!');
      } else {
        throw new Error(data.error || 'Failed to add to wishlist');
      }
    } catch (error: any) {
      console.error('Failed to add to wishlist:', error);
      toast.error(error.message || 'Failed to add item to wishlist');
    }
  };

  const removeFromWishlist = async (productId: string) => {
    if (!user) return;

    try {
      const response = await fetch('/api/wishlist', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
      });

      const data = await response.json();

      if (response.ok) {
        setWishlist(prev => prev.filter(item => item.id !== productId));
        toast.success('Removed from wishlist!');
      } else {
        throw new Error(data.error || 'Failed to remove from wishlist');
      }
    } catch (error: any) {
      console.error('Failed to remove from wishlist:', error);
      toast.error(error.message || 'Failed to remove item from wishlist');
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some(item => item.id === productId);
  };

  return (
    <WishlistContext.Provider value={{
      wishlist,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      isLoading,
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}