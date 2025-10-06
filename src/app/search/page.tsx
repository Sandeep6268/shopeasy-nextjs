// app/search/page.tsx
import ProductCard from '@/components/products/ProductCard';

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
  }>;
}

async function searchProducts(query: string) {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const url = new URL('/api/products', baseUrl);
    
    if (query) {
      url.searchParams.set('search', query);
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`Failed to search products: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching products:', error);
    return { products: [], pagination: {} };
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q || '';
  
  const { products, pagination } = await searchProducts(query);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {query ? `Search Results for "${query}"` : 'Search Products'}
        </h1>
        
        {query && (
          <p className="text-gray-600">
            Found {pagination?.total || products.length} product{pagination?.total !== 1 ? 's' : ''} matching your search
          </p>
        )}
        
        {!query && (
          <p className="text-gray-600">
            Enter a search term to find products
          </p>
        )}
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : query ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600">Try adjusting your search terms or browse all products.</p>
          <a
            href="/products"
            className="inline-block mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
          >
            Browse All Products
          </a>
        </div>
      ) : null}
    </div>
  );
}