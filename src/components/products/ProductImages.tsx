// components/products/ProductImages.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Product } from '@/types';

interface ProductImagesProps {
  product: Product;
}

export default function ProductImages({ product }: ProductImagesProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  // Use images array from product
  const images = product.images || [];

  if (images.length === 0) {
    return (
      <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
        <span className="text-gray-500">No image available</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="bg-gray-100 rounded-lg overflow-hidden">
        <Image
          src={images[selectedImage]}
          alt={product.name}
          width={600}
          height={600}
          className="w-full h-96 object-cover"
          onError={(e) => {
            e.currentTarget.src = '/placeholder-product.jpg';
          }}
        />
      </div>

      {/* Thumbnail Images */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-4">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`bg-gray-100 rounded-lg overflow-hidden border-2 ${
                selectedImage === index ? 'border-blue-500' : 'border-transparent'
              }`}
            >
              <Image
                src={image}
                alt={`${product.name} ${index + 1}`}
                width={100}
                height={100}
                className="w-full h-24 object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder-product.jpg';
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}