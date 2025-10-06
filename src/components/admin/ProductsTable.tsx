// components/admin/ProductsTable.tsx - UPDATED WITH MODAL
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PencilIcon, TrashIcon, EyeIcon, PlusIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import ConfirmModal from '@/components/ui/ConfirmModal';

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

interface ProductsTableProps {
  products: Product[];
  loading: boolean;
  onProductUpdate: () => void;
}

export default function ProductsTable({ products, loading, onProductUpdate }: ProductsTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<{ id: string; name: string } | null>(null);
  const router = useRouter();

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteClick = (productId: string, productName: string) => {
    setSelectedProduct({ id: productId, name: productName });
    setModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedProduct) return;

    setDeletingId(selectedProduct.id);
    setModalOpen(false);

    const deleteToast = toast.loading('Deleting product...');
    
    try {
      const response = await fetch(`/api/admin/products/${selectedProduct.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Product deleted successfully', { id: deleteToast });
        onProductUpdate();
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to delete product', { id: deleteToast });
      }
    } catch (error) {
      console.error('Delete product error:', error);
      toast.error('Failed to delete product', { id: deleteToast });
    } finally {
      setDeletingId(null);
      setSelectedProduct(null);
    }
  };

  const handleView = (productId: string) => {
    router.push(`/products/${productId}`);
  };

  const handleEdit = (productId: string) => {
    router.push(`/admin/products/${productId}/edit`);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="animate-pulse">
          <div className="h-16 bg-gray-200 rounded-t-lg"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 border-b border-gray-200 last:border-0"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border">
        {/* Search and Filters */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">All Categories</option>
                <option value="electronics">Electronics</option>
                <option value="clothing">Clothing</option>
                <option value="books">Books</option>
                <option value="home">Home</option>
                <option value="beauty">Beauty</option>
                <option value="sports">Sports</option>
                <option value="other">Other</option>
              </select>
              <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="draft">Draft</option>
              </select>
            </div>
            
            {/* Add Product Button */}
            <Link
              href="/admin/products/new"
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              <PlusIcon className="h-4 w-4" />
              Add Product
            </Link>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Inventory
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {product.images && product.images.length > 0 ? (
                          <div className="relative h-10 w-10">
                            <Image
                              src={product.images[0]}
                              alt={product.name}
                              fill
                              className="rounded-lg object-cover"
                              onError={(e) => {
                                e.currentTarget.src = '/placeholder-product.jpg';
                              }}
                            />
                          </div>
                        ) : (
                          <div className="h-10 w-10 bg-gray-200 rounded-lg flex items-center justify-center">
                            <span className="text-gray-400 text-xs">No Image</span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {product.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {product.featured && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                              Featured
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 capitalize">{product.category}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      ${product.price}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {product.inventory}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : product.status === 'inactive'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleView(product.id)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                        title="View Product"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleEdit(product.id)}
                        className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                        title="Edit Product"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteClick(product.id, product.name)}
                        disabled={deletingId === product.id}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 disabled:opacity-50"
                        title="Delete Product"
                      >
                        {deletingId === product.id ? (
                          <div className="h-4 w-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <TrashIcon className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No products found</p>
            <Link
              href="/admin/products/new"
              className="inline-block mt-2 text-blue-600 hover:text-blue-800 font-medium"
            >
              Add your first product
            </Link>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Product"
        message={`Are you sure you want to delete "${selectedProduct?.name}"? This action cannot be undone.`}
        confirmText="Delete Product"
        cancelText="Cancel"
        type="delete"
      />
    </>
  );
}