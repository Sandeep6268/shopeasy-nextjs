// app/admin/products/new/page.tsx - UPDATED WITH CLOUDINARY
'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import toast from 'react-hot-toast';

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  comparePrice: number;
  category: string;
  tags: string;
  inventory: number;
  featured: boolean;
  status: 'active' | 'inactive' | 'draft';
  images: string[];
}

interface CloudinaryImage {
  url: string;
  publicId?: string;
}

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: 0,
    comparePrice: 0,
    category: '',
    tags: '',
    inventory: 0,
    featured: false,
    status: 'active',
    images: []
  });

  const [uploadedImages, setUploadedImages] = useState<CloudinaryImage[]>([]);

  // Drag and Drop handlers
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const { files } = e.dataTransfer;
    if (files && files.length > 0) {
      handleFileUpload(files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length > 0) {
      handleFileUpload(files);
    }
  };

  const handleFileUpload = async (files: FileList) => {
    if (files.length === 0) return;

    setUploading(true);
    const uploadToast = toast.loading('Uploading images to Cloudinary...');
    
    try {
      const uploadFormData = new FormData();
      
      for (let i = 0; i < files.length; i++) {
        uploadFormData.append('images', files[i]);
      }

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      const data = await response.json();

      if (response.ok) {
        const newImages = data.urls.map((url: string, index: number) => ({
          url,
          publicId: data.details?.[index]?.publicId
        }));

        setUploadedImages(prev => [...prev, ...newImages]);
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, ...data.urls]
        }));
        
        toast.success('Images uploaded to Cloudinary successfully!', { id: uploadToast });
      } else {
        toast.error(data.error || 'Failed to upload images', { id: uploadToast });
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload images', { id: uploadToast });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeImage = async (index: number) => {
    const imageToRemove = uploadedImages[index];
    
    // Delete from Cloudinary if publicId is available
    if (imageToRemove?.publicId) {
      try {
        await fetch(`/api/admin/upload/delete?publicId=${imageToRemove.publicId}`, {
          method: 'DELETE',
        });
      } catch (error) {
        console.error('Error deleting from Cloudinary:', error);
      }
    }

    // Remove from local state
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    
    toast.success('Image removed');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.images.length === 0) {
      toast.error('Please upload at least one product image');
      return;
    }

    setLoading(true);
    const createToast = toast.loading('Creating product...');
    
    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        comparePrice: Number(formData.comparePrice) || undefined,
        images: formData.images,
        category: formData.category,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        inventory: Number(formData.inventory),
        featured: Boolean(formData.featured),
        status: formData.status
      };

      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        toast.success('Product created successfully!', { id: createToast });
        router.push('/admin/products');
        router.refresh();
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to create product', { id: createToast });
      }
    } catch (error: any) {
      console.error('Error creating product:', error);
      toast.error(`Failed to create product: ${error.message}`, { id: createToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/products"
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
            <p className="text-gray-600">Create a new product for your store</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border p-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Basic Information */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
          </div>

          <div className="md:col-span-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Product Name *
            </label>
            <input
              type="text"
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter product name"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter product description"
            />
          </div>

          {/* Pricing */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
              Price *
            </label>
            <input
              type="number"
              id="price"
              required
              min="0"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
            />
          </div>

          <div>
            <label htmlFor="comparePrice" className="block text-sm font-medium text-gray-700 mb-2">
              Compare Price
            </label>
            <input
              type="number"
              id="comparePrice"
              min="0"
              step="0.01"
              value={formData.comparePrice}
              onChange={(e) => setFormData(prev => ({ ...prev, comparePrice: parseFloat(e.target.value) || 0 }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
            />
          </div>

          {/* Inventory */}
          <div>
            <label htmlFor="inventory" className="block text-sm font-medium text-gray-700 mb-2">
              Inventory *
            </label>
            <input
              type="number"
              id="inventory"
              required
              min="0"
              value={formData.inventory}
              onChange={(e) => setFormData(prev => ({ ...prev, inventory: parseInt(e.target.value) || 0 }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              id="category"
              required
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Category</option>
              <option value="electronics">Electronics</option>
              <option value="clothing">Clothing</option>
              <option value="books">Books</option>
              <option value="home">Home</option>
              <option value="beauty">Beauty</option>
              <option value="sports">Sports</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Tags */}
          <div className="md:col-span-2">
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <input
              type="text"
              id="tags"
              value={formData.tags}
              onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="tag1, tag2, tag3"
            />
            <p className="text-sm text-gray-500 mt-1">Separate tags with commas</p>
          </div>

          {/* Image Upload */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Images * {formData.images.length > 0 && `(${formData.images.length} uploaded)`}
            </label>
            
            {/* File Upload Area */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors"
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                multiple
                accept="image/*"
                className="hidden"
              />
              
              <div className="space-y-2">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="flex text-sm text-gray-600 justify-center">
                  <label 
                    htmlFor="file-upload" 
                    className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500"
                  >
                    <span>Upload images to Cloudinary</span>
                    <input 
                      id="file-upload"
                      name="file-upload"
                      type="file" 
                      className="sr-only" 
                      multiple 
                      onChange={handleFileSelect}
                      accept="image/*"
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF up to 5MB each - Stored securely on Cloudinary
                </p>
              </div>
            </div>

            {uploading && (
              <div className="mt-4 text-center">
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <p className="text-sm text-gray-600">Uploading images to Cloudinary...</p>
                </div>
              </div>
            )}

            {/* Uploaded Images Preview */}
            {formData.images.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-3">Uploaded Images ({formData.images.length}):</p>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <Image
                        src={image}
                        alt={`Product image ${index + 1}`}
                        width={200}
                        height={200}
                        className="w-full h-24 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                        title="Remove image"
                      >
                        ×
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        Cloudinary
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="featured"
              checked={formData.featured}
              onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
              Featured Product
            </label>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
          <Link
            href="/admin/products"
            className="px-6 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading || formData.images.length === 0 || !formData.category}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
            {loading ? 'Creating...' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
}