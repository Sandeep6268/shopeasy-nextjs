import Link from 'next/link';
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  salesCount: number;
  rating: number;
}

interface PopularProductsProps {
  products: Product[];
}

export default function PopularProducts({ products }: PopularProductsProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Popular Products</h3>
        <Link
          href="/admin/products"
          className="text-sm text-blue-600 hover:text-blue-500 font-medium"
        >
          View all
        </Link>
      </div>

      <div className="space-y-4">
        {products.length > 0 ? (
          products.map((product) => (
            <div
              key={product.id}
              className="flex items-center space-x-4 py-3 border-b border-gray-200 last:border-0"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-gray-200 rounded-lg overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {product.name}
                </p>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>${product.price}</span>
                  <span>•</span>
                  <span>{product.salesCount} sales</span>
                  <span>•</span>
                  <span className="flex items-center">
                    ⭐ {product.rating}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No products available</p>
          </div>
        )}
      </div>
    </div>
  );
}