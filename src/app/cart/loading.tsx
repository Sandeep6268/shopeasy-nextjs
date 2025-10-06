export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div className="h-8 bg-gray-300 rounded w-1/4 animate-pulse"></div>
        <div className="h-6 bg-gray-300 rounded w-20 animate-pulse"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items Skeleton */}
        <div className="lg:col-span-2 space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm border flex items-center space-x-4 animate-pulse">
              <div className="w-20 h-20 bg-gray-300 rounded-lg flex-shrink-0"></div>
              <div className="flex-grow space-y-2">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/4"></div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-300 rounded"></div>
                <div className="w-8 h-8 bg-gray-300 rounded"></div>
                <div className="w-8 h-8 bg-gray-300 rounded"></div>
              </div>
              <div className="text-right space-y-2">
                <div className="h-4 bg-gray-300 rounded w-16"></div>
                <div className="h-4 bg-gray-300 rounded w-12"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Skeleton */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-sm border space-y-4 animate-pulse">
            <div className="h-6 bg-gray-300 rounded w-1/2"></div>
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex justify-between">
                  <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                </div>
              ))}
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between">
                <div className="h-6 bg-gray-300 rounded w-1/4"></div>
                <div className="h-6 bg-gray-300 rounded w-1/4"></div>
              </div>
            </div>
            <div className="h-12 bg-gray-300 rounded"></div>
            <div className="h-12 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}