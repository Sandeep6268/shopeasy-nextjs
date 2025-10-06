// app/products/page.tsx - FULLY UPDATED
import ProductCard from '@/components/products/ProductCard';
import ProductFilters from '@/components/products/ProductFilters';

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    maxPrice?: string;
    inStock?: string;
    page?: string;
  }>;
}

async function getProducts(filters: any = {}) {
  try {
    // Production mein same origin use karein - relative URL
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'process.env.APP_URL' 
      : 'process.env.APP_URL';
    
    const url = new URL('/api/products', baseUrl);
    
    // Add filter parameters to URL
    Object.keys(filters).forEach(key => {
      if (filters[key] && filters[key] !== 'undefined') {
        url.searchParams.set(key, filters[key]);
      }
    });

    // Add default limit
    if (!filters.limit) {
      url.searchParams.set('limit', '12');
    }

    console.log('🔄 Fetching products from:', url.toString());

    const response = await fetch(url.toString(), {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('❌ Products API error:', response.status, response.statusText);
      throw new Error(`Products API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Products API success:', {
      productsCount: data.products?.length || 0,
      total: data.pagination?.total || 0,
      filters: data.filters || {}
    });
    
    return data;
  } catch (error: any) {
    console.error('💥 Error fetching products:', error.message);
    return { 
      products: [], 
      pagination: { total: 0, page: 1, pages: 0 }, 
      filters: {} 
    };
  }
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const { products, pagination, filters } = await getProducts(params);

  console.log('📦 Products page data:', {
    productsCount: products.length,
    params: params,
    filters: filters
  });

  const getPageTitle = () => {
    if (filters?.category) {
      const category = Array.isArray(filters.category) ? filters.category[0] : filters.category;
      return `${category.charAt(0).toUpperCase() + category.slice(1)} Products`;
    }
    if (filters?.search) {
      return `Search Results for "${filters.search}"`;
    }
    if (filters?.inStock === 'true') {
      return 'In Stock Products';
    }
    if (filters?.maxPrice) {
      return `Products Under $${filters.maxPrice}`;
    }
    return 'All Products';
  };

  const getPageDescription = () => {
    if (filters?.category) {
      const category = Array.isArray(filters.category) ? filters.category[0] : filters.category;
      return `Browse our ${category.toLowerCase()} collection`;
    }
    if (filters?.search) {
      return `Found ${pagination?.total || 0} products matching "${filters.search}"`;
    }
    if (filters?.inStock === 'true') {
      return 'Showing only products currently in stock';
    }
    if (filters?.maxPrice) {
      return `Products priced under $${filters.maxPrice}`;
    }
    return `Discover ${pagination?.total || 0} amazing products in our collection`;
  };

  const hasActiveFilters = () => {
    return !!(filters?.category || filters?.search || filters?.maxPrice || filters?.inStock);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {getPageTitle()}
              </h1>
              <p className="text-gray-600 text-lg">
                {getPageDescription()}
              </p>
            </div>
            
            {/* Debug Info */}
            <div className="mt-4 lg:mt-0 lg:ml-4">
              <div className="bg-white border border-gray-200 rounded-lg px-4 py-2">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">{products.length}</span> of{' '}
                  <span className="font-semibold">{pagination?.total || 0}</span> products
                </p>
              </div>
            </div>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters() && (
            <div className="mt-4">
              <a
                href="/products"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Clear all filters
              </a>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
              <ProductFilters initialFilters={filters} />
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-gray-600">
                    Showing <span className="font-semibold">{products.length}</span> of{' '}
                    <span className="font-semibold">{pagination?.total || 0}</span> product
                    {pagination?.total !== 1 ? 's' : ''}
                  </p>
                  {hasActiveFilters() && (
                    <p className="text-sm text-gray-500 mt-1">
                      Use filters to refine your search
                    </p>
                  )}
                </div>
                
                {/* Sort Options (Can be added later) */}
                <div className="mt-2 sm:mt-0">
                  <select className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Sort by: Newest</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Name: A to Z</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product: any) => (
                  <ProductCard 
                    key={product._id || product.id} 
                    product={product} 
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <div className="max-w-md mx-auto">
                  <svg className="w-24 h-24 text-gray-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No products found
                  </h3>
                  
                  <p className="text-gray-600 mb-6">
                    {hasActiveFilters() 
                      ? 'Try adjusting your filters or search terms.' 
                      : 'No products are currently available. Check back later or contact support.'
                    }
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    {hasActiveFilters() && (
                      <a
                        href="/products"
                        className="inline-flex items-center justify-center bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
                      >
                        Clear Filters
                      </a>
                    )}
                    <a
                      href="/"
                      className="inline-flex items-center justify-center border border-gray-300 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-50 transition duration-300"
                    >
                      Return Home
                    </a>
                  </div>

                  {/* Admin Help */}
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700">
                      <strong>Admin:</strong> Add products from the{' '}
                      <a href="/admin/products" className="underline hover:text-blue-800">
                        admin panel
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Pagination (Can be added later) */}
            {pagination?.pages > 1 && (
              <div className="mt-8 flex justify-center">
                <div className="flex space-x-2">
                  <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50">
                    Previous
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md">
                    1
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50">
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}