// components/products/ProductCard.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import WishlistButton from '@/components/products/WishlistButton';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const { addItem } = useCart();
  const [addingToCart, setAddingToCart] = useState(false);
  
  // Use the first image from the images array, or a placeholder
  const imageUrl = (product.images && product.images.length > 0 && !imageError) 
    ? product.images[0] 
    : '/placeholder-product.jpg';

  const handleAddToCart = async () => {
    if (product.inventory === 0) {
      toast.error('Product is out of stock');
      return;
    }

    setAddingToCart(true);
    try {
      // Ensure product has images array
      const productWithImages = {
        ...product,
        images: product.images || [] // Ensure images array exists
      };
      
      await addItem(productWithImages);
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      toast.error('Failed to add product to cart');
      console.error('Add to cart error:', error);
    } finally {
      setAddingToCart(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300 group">
      <div className="relative">
        <Link href={`/products/${product.id}`}>
          <div className="aspect-w-16 aspect-h-9 bg-gray-200">
            <Image
              src={imageUrl}
              alt={product.name}
              width={300}
              height={200}
              className="w-full h-48 object-cover"
              onError={() => setImageError(true)}
            />
          </div>
        </Link>
        
        {/* Wishlist Button - Top Right Corner */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <WishlistButton product={product} size="sm" />
        </div>

        {/* Featured Badge */}
        {product.featured && (
          <div className="absolute top-2 left-2">
            <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
              Featured
            </span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-lg text-gray-900 hover:text-blue-600 transition-colors mb-2">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-900">
              ${product.price}
            </span>
            {product.comparePrice && product.comparePrice > product.price && (
              <span className="text-sm text-gray-500 line-through">
                ${product.comparePrice}
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-1">
            <span className="text-yellow-400">⭐</span>
            <span className="text-sm text-gray-600">
              {product.rating || 0} ({product.reviewCount || 0})
            </span>
          </div>
        </div>
        
        <div className="mt-3 flex items-center justify-between">
          <span className={`text-sm px-2 py-1 rounded-full ${
            (product.inventory || 0) > 0 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {(product.inventory || 0) > 0 ? 'In Stock' : 'Out of Stock'}
          </span>
          
          <button 
            onClick={handleAddToCart}
            disabled={addingToCart || product.inventory === 0}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              product.inventory === 0
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                : addingToCart
                ? 'bg-blue-400 text-white cursor-wait'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {addingToCart ? 'Adding...' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}