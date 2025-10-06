// app/products/page.tsx - Add debugging
import ProductCard from '@/components/products/ProductCard';
import ProductFilters from '@/components/products/ProductFilters';

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    maxPrice?: string;
    inStock?: string;
  }>;
}

async function getProducts(filters: {
  category?: string;
  search?: string;
  maxPrice?: string;
  inStock?: string;
}) {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const url = new URL('/api/products', baseUrl);
    
    // Add filter parameters to URL
    if (filters.category) url.searchParams.set('category', filters.category);
    if (filters.search) url.searchParams.set('search', filters.search);
    if (filters.maxPrice) url.searchParams.set('maxPrice', filters.maxPrice);
    if (filters.inStock) url.searchParams.set('inStock', filters.inStock);

    console.log('Fetching from URL:', url.toString());

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status}`);
    }

    const data = await response.json();
    console.log('API Response:', data);
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    return { products: [], pagination: {}, filters: {} };
  }
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const { products, pagination, filters } = await getProducts(params);

  const getPageTitle = () => {
    if (filters?.category) {
      const categories = filters.category.split(',');
      if (categories.length === 1) {
        return `${categories[0].charAt(0).toUpperCase() + categories[0].slice(1)} Products`;
      } else {
        return 'Multiple Categories';
      }
    }
    if (filters?.search) {
      return `Search Results for "${filters.search}"`;
    }
    return 'All Products';
  };

  const getPageDescription = () => {
    if (filters?.category) {
      const categories = filters.category.split(',');
      if (categories.length === 1) {
        return `Browse our ${categories[0].toLowerCase()} collection`;
      } else {
        return `Products from ${categories.length} categories`;
      }
    }
    if (filters?.search) {
      return `Found ${pagination?.total || 0} products matching your search`;
    }
    if (filters?.inStock === 'true') {
      return 'Showing only products in stock';
    }
    if (filters?.maxPrice) {
      return `Products under $${filters.maxPrice}`;
    }
    return 'Discover our amazing collection of products';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {getPageTitle()}
        </h1>
        <p className="text-gray-600">
          {getPageDescription()}
        </p>
        {(filters?.category || filters?.search || filters?.maxPrice || filters?.inStock) && (
          <a
            href="/products"
            className="inline-block mt-2 text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Clear all filters
          </a>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <ProductFilters />
        </div>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          <div className="mb-4 flex justify-between items-center">
            <p className="text-gray-600">
              Showing {products.length} of {pagination?.total || 0} product{products.length !== 1 ? 's' : ''}
            </p>
            {/* You can add sorting here later */}
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your filters or search terms.</p>
              <a
                href="/products"
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
              >
                Browse All Products
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}