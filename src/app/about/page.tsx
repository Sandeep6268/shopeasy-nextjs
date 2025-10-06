export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">About ShopEasy</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Your trusted partner for quality products and exceptional shopping experience
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Story</h2>
          <p className="text-gray-700 mb-4">
            Founded in 2024, ShopEasy started with a simple mission: to make online shopping 
            easy, enjoyable, and accessible to everyone. We believe that everyone deserves 
            access to quality products at fair prices.
          </p>
          <p className="text-gray-700">
            What started as a small team of passionate individuals has grown into a 
            comprehensive e-commerce platform serving customers worldwide with carefully 
            curated products and exceptional service.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-gray-700 mb-4">
            We're committed to providing our customers with the best shopping experience 
            possible. From the moment you land on our site to the delivery of your order, 
            we strive for excellence in every interaction.
          </p>
          <p className="text-gray-700">
            Our mission is to bridge the gap between quality and affordability, ensuring 
            that our customers never have to compromise on either.
          </p>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Why Choose ShopEasy?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Quality Guaranteed</h3>
            <p className="text-gray-600">Every product is carefully selected and quality tested</p>
          </div>

          <div className="text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Best Prices</h3>
            <p className="text-gray-600">Competitive pricing without compromising on quality</p>
          </div>

          <div className="text-center">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Fast Shipping</h3>
            <p className="text-gray-600">Quick and reliable delivery to your doorstep</p>
          </div>
        </div>
      </div>
    </div>
  );
}