// app/admin/products/page.tsx - UPDATED
'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import ProductsTable from '@/components/admin/ProductsTable';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  inventory: number;
  status: string;
  rating: number;
  reviewCount: number;
  images: string[];
  featured: boolean;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/admin/products');
      const data = await response.json();
      
      if (response.ok) {
        setProducts(data.products);
      } else {
        console.error('Failed to fetch products:', data.error);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      
      <div className="flex-1 p-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Products</h1>
            <p className="text-gray-600">Manage your store products</p>
          </div>
          
          <ProductsTable 
            products={products} 
            loading={loading}
            onProductUpdate={fetchProducts} // Pass refresh function
          />
        </div>
      </div>
    </div>
  );
}