// components/products/ProductFilters.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ProductFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);

  // Initialize filters from URL params
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategories(categoryParam.split(','));
    }
    
    const priceParam = searchParams.get('maxPrice');
    if (priceParam) {
      setPriceRange([0, parseInt(priceParam)]);
    }
    
    const stockParam = searchParams.get('inStock');
    if (stockParam === 'true') {
      setInStockOnly(true);
    }
  }, [searchParams]);

  const categories = ['electronics', 'clothing', 'books', 'home', 'beauty', 'sports', 'other'];

  const updateFilters = () => {
    const params = new URLSearchParams();
    
    // Category filter
    if (selectedCategories.length > 0) {
      params.set('category', selectedCategories.join(','));
    }
    
    // Price filter
    if (priceRange[1] < 1000) {
      params.set('maxPrice', priceRange[1].toString());
    }
    
    // Stock filter
    if (inStockOnly) {
      params.set('inStock', 'true');
    }
    
    // Update URL
    const queryString = params.toString();
    router.push(`/products?${queryString}`, { scroll: false });
  };

  const handleCategoryChange = (category: string) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category];
    
    setSelectedCategories(newCategories);
  };

  const handlePriceChange = (maxPrice: number) => {
    setPriceRange([0, maxPrice]);
  };

  const handleStockChange = (inStock: boolean) => {
    setInStockOnly(inStock);
  };

  // Apply filters when any filter changes
  useEffect(() => {
    const timeoutId = setTimeout(updateFilters, 300); // Debounce
    return () => clearTimeout(timeoutId);
  }, [selectedCategories, priceRange, inStockOnly]);

  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 1000]);
    setInStockOnly(false);
    router.push('/products', { scroll: false });
  };

  const hasActiveFilters = selectedCategories.length > 0 || priceRange[1] < 1000 || inStockOnly;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border space-y-6 sticky top-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Price Range */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3">Price Range</h4>
        <div className="space-y-2">
          <input
            type="range"
            min="0"
            max="1000"
            step="10"
            value={priceRange[1]}
            onChange={(e) => handlePriceChange(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>$0</span>
            <span>Up to ${priceRange[1]}</span>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3">Categories</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {categories.map((category) => (
            <label key={category} className="flex items-center">
              <input
                type="checkbox"
                checked={selectedCategories.includes(category)}
                onChange={() => handleCategoryChange(category)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-gray-700 capitalize">
                {category}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3">Availability</h4>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => handleStockChange(e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 text-gray-700">In Stock Only</span>
        </label>
      </div>

      {/* Active Filters Badge */}
      {hasActiveFilters && (
        <div className="border-t pt-4">
          <h4 className="font-medium text-gray-900 mb-2">Active Filters</h4>
          <div className="flex flex-wrap gap-2">
            {selectedCategories.map(category => (
              <span
                key={category}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {category}
                <button
                  onClick={() => handleCategoryChange(category)}
                  className="ml-1 hover:text-blue-600"
                >
                  ×
                </button>
              </span>
            ))}
            {priceRange[1] < 1000 && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Under ${priceRange[1]}
                <button
                  onClick={() => handlePriceChange(1000)}
                  className="ml-1 hover:text-green-600"
                >
                  ×
                </button>
              </span>
            )}
            {inStockOnly && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                In Stock
                <button
                  onClick={() => handleStockChange(false)}
                  className="ml-1 hover:text-purple-600"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}