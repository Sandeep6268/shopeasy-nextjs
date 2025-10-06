// app/categories/page.tsx - UPDATED WITH BACKEND
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Category {
  name: string;
  count: number;
  image: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/categories');
      
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }

      const data = await response.json();
      setCategories(data.categories || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  // Default placeholder image
  const getImageUrl = (image: string | undefined) => {
    if (!image) {
      return '/images/placeholder.jpg';
    }
    return image;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Product Categories</h1>
          <p className="text-gray-600">Browse our wide range of product categories</p>
        </div>
        
        {/* Loading Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-300 w-full"></div>
              <div className="p-4">
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Categories</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchCategories}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Product Categories</h1>
        <p className="text-gray-600">
          Browse our wide range of product categories
        </p>
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-4">No categories found</div>
          <p className="text-gray-400">Categories will appear here once products are added.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={`/products?category=${encodeURIComponent(category.name)}`}
              className="group block"
            >
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300 border border-gray-200">
                <div className="relative h-48 w-full">
                  <Image
                    src={getImageUrl(category.image)}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-105 transition duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    onError={(e) => {
                      // Fallback if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.src = '/images/placeholder.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="text-center text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="text-xl font-semibold mb-2 capitalize">{category.name}</h3>
                      <p className="text-sm opacity-90">
                        {category.count} product{category.count !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  
                  {/* Category badge */}
                  <div className="absolute top-3 right-3 bg-white bg-opacity-90 rounded-full px-3 py-1">
                    <span className="text-sm font-medium text-gray-800">
                      {category.count}
                    </span>
                  </div>
                </div>
                
                {/* Mobile/Tablet info (always visible) */}
                <div className="p-4 lg:hidden">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1 capitalize">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {category.count} product{category.count !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}