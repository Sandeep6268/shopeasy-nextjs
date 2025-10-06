// app/products/[id]/page.tsx - Updated with real-time rating updates
'use client'; // Add this to make it a client component

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import ProductImages from '@/components/products/ProductImages';
import AddToCart from '@/components/products/AddToCart';
import ReviewsSection from '@/components/reviews/ReviewsSection';

interface ProductPageProps {
  params: {
    id: string;
  };
}

async function getProduct(id: string) {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/products/${id}`, {
      cache: 'no-store'
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch product');
    }

    const data = await response.json();
    return data.product;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export default function ProductPage({ params }: ProductPageProps) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProduct();
    
    // Listen for review submissions to update rating in real-time
    const handleReviewSubmitted = (event: CustomEvent) => {
      if (event.detail.productId === params.id) {
        setProduct((prev: any) => ({
          ...prev,
          rating: event.detail.newRating,
          reviewCount: event.detail.newReviewCount
        }));
      }
    };

    // Add event listener
    window.addEventListener('reviewSubmitted', handleReviewSubmitted as EventListener);
    
    return () => {
      window.removeEventListener('reviewSubmitted', handleReviewSubmitted as EventListener);
    };
  }, [params.id]);

  const loadProduct = async () => {
    const productData = await getProduct(params.id);
    if (!productData) {
      notFound();
    }
    setProduct(productData);
    setLoading(false);
  };

  if (loading || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="h-96 bg-gray-200 rounded"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div>
          <ProductImages product={product} />
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`w-5 h-5 ${
                      star <= Math.floor(product.rating || 0)
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
              <span className="text-gray-600">
                {product.rating || 0} ({product.reviewCount || 0} reviews)
              </span>
              {(product.inventory || 0) > 0 ? (
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                  In Stock
                </span>
              ) : (
                <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-medium">
                  Out of Stock
                </span>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-baseline space-x-3">
              <span className="text-3xl font-bold text-gray-900">
                ${product.price}
              </span>
              {product.comparePrice && product.comparePrice > product.price && (
                <span className="text-xl text-gray-500 line-through">
                  ${product.comparePrice}
                </span>
              )}
              {product.comparePrice && product.comparePrice > product.price && (
                <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-medium">
                  Save ${(product.comparePrice - product.price).toFixed(2)}
                </span>
              )}
            </div>

            <p className="text-gray-700 text-lg leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Add to Cart Section */}
          <AddToCart product={product} />

          {/* Reviews Section - Pass initial data */}
          <ReviewsSection 
            productId={product.id} 
            productName={product.name}
            initialRating={product.rating}
            initialReviewCount={product.reviewCount}
          />

          {/* Additional Info */}
          <div className="border-t pt-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-semibold text-gray-900">Category:</span>
                <span className="ml-2 text-gray-600 capitalize">{product.category}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-900">SKU:</span>
                <span className="ml-2 text-gray-600">{product.id}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-900">Inventory:</span>
                <span className="ml-2 text-gray-600">{product.inventory || 0} units</span>
              </div>
              {product.tags && product.tags.length > 0 && (
                <div>
                  <span className="font-semibold text-gray-900">Tags:</span>
                  <span className="ml-2 text-gray-600">{product.tags.join(', ')}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}