// components/products/ProductCard.tsx - UPDATED
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

interface ProductCardProps {
  product: any;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);

  const productId = product._id || product.id;
  const productName = product.name || 'Unnamed Product';
  const productPrice = product.price || 0;
  const productImage = product.images?.[0] || '/images/placeholder.jpg';
  const productCategory = product.category || 'Uncategorized';
  const productInventory = product.inventory || 0;

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition duration-300">
      <Link href={`/products/${productId}`} className="block">
        <div className="relative h-48 w-full bg-gray-100">
          {!imageError ? (
            <Image
              src={productImage}
              alt={productName}
              fill
              className="object-cover hover:scale-105 transition duration-300"
              onError={handleImageError}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          
          {/* Category Badge */}
          <div className="absolute top-2 left-2">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
              {productCategory}
            </span>
          </div>

          {/* Stock Badge */}
          <div className="absolute top-2 right-2">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              productInventory > 0 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {productInventory > 0 ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>
        </div>

        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {productName}
          </h3>
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {product.description || 'No description available'}
          </p>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">
                ${productPrice}
              </p>
              {product.comparePrice && product.comparePrice > productPrice && (
                <p className="text-sm text-gray-500 line-through">
                  ${product.comparePrice}
                </p>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center">
              <div className="flex items-center">
                {[0, 1, 2, 3, 4].map((rating) => (
                  <svg
                    key={rating}
                    className={`h-4 w-4 flex-shrink-0 ${
                      (product.rating || 0) > rating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="ml-1 text-sm text-gray-500">
                ({product.reviewCount || 0})
              </span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-4 flex space-x-2">
            <button
              className="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-sm font-medium hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={productInventory === 0}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                // Add to cart logic here
              }}
            >
              Add to Cart
            </button>
            <button
              className="bg-gray-200 text-gray-700 py-2 px-3 rounded text-sm font-medium hover:bg-gray-300 transition duration-200"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                // Add to wishlist logic here
              }}
            >
              ♡
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
}