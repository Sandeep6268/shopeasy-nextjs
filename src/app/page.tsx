// app/page.tsx - FULLY UPDATED
import Link from 'next/link';
import ProductCard from '@/components/products/ProductCard';

async function getFeaturedProducts() {
  try {
    // Production mein same origin use karein - relative URL
    const baseUrl = process.env.APP_URL === 'production' 
      ? '' 
      : 'process.env.APP_URL';
    
    console.log('🔄 Fetching featured products from:', `${baseUrl}/api/products?limit=4`);
    
    const response = await fetch(`${baseUrl}/api/products?limit=4`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('❌ API response not OK:', response.status, response.statusText);
      return [];
    }

    const data = await response.json();
    console.log('✅ Products fetched successfully:', data.products?.length || 0);
    return data.products?.slice(0, 4) || [];
  } catch (error: any) {
    console.error('💥 Error fetching featured products:', error.message);
    return [];
  }
}

export default async function Home() {
  const featuredProducts = await getFeaturedProducts();
  
  console.log('🏠 Homepage rendering with products:', featuredProducts.length);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Welcome to ShopEasy
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Discover amazing products at unbeatable prices
            </p>
            <Link
              href="/products"
              className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition duration-300"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Featured Products
          </h2>
          <p className="text-lg text-gray-600">
            Check out our most popular items
          </p>
        </div>

        {/* Debug Info */}
        <div className="text-center mb-6">
          <div className="inline-block bg-gray-100 px-4 py-2 rounded-lg">
            <p className="text-sm text-gray-600">
              <span className="font-semibold">{featuredProducts.length}</span> products loaded
            </p>
          </div>
        </div>

        {/* Products Grid */}
        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product: any) => (
              <ProductCard 
                key={product._id || product.id} 
                product={product} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md mx-auto">
              <svg className="w-12 h-12 text-yellow-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">No Products Available</h3>
              <p className="text-yellow-700 text-sm mb-4">
                Products are not loading. This could be due to:
              </p>
              <ul className="text-yellow-600 text-sm text-left list-disc list-inside space-y-1 mb-4">
                <li>Database connection issue</li>
                <li>No active products in database</li>
                <li>API endpoint not working</li>
              </ul>
              <div className="space-x-4">
                <Link
                  href="/admin/products"
                  className="inline-block bg-yellow-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-yellow-700"
                >
                  Add Products (Admin)
                </Link>
                <Link
                  href="/products"
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700"
                >
                  View All Products
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* View All Button */}
        {featuredProducts.length > 0 && (
          <div className="text-center mt-12">
            <Link
              href="/products"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
            >
              View All Products ({featuredProducts.length}+)
            </Link>
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose ShopEasy?
            </h2>
            <p className="text-lg text-gray-600">
              We provide the best shopping experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Free Shipping</h3>
              <p className="text-gray-600">Free shipping on orders over $50</p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Payment</h3>
              <p className="text-gray-600">Your payment information is safe with us</p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Returns</h3>
              <p className="text-gray-600">30-day return policy on all items</p>
            </div>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Need Help?
          </h2>
          <p className="text-gray-600 mb-6">
            Our support team is here to help you with any questions
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-block bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-900 transition duration-300"
            >
              Contact Support
            </Link>
            <Link
              href="/faq"
              className="inline-block border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition duration-300"
            >
              View FAQ
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}