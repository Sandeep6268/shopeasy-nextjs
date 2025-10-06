export default function ProductDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
        {/* Image Skeleton */}
        <div>
          <div className="h-96 bg-gray-300 rounded-lg mb-4"></div>
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-20 bg-gray-300 rounded-md"></div>
            ))}
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="space-y-6">
          <div>
            <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
          </div>

          <div className="space-y-4">
            <div className="h-6 bg-gray-300 rounded w-1/4"></div>
            <div className="h-4 bg-gray-300 rounded w-full"></div>
            <div className="h-4 bg-gray-300 rounded w-2/3"></div>
          </div>

          <div className="space-y-4">
            <div className="h-4 bg-gray-300 rounded w-1/3"></div>
            <div className="flex space-x-2">
              <div className="h-10 bg-gray-300 rounded w-16"></div>
              <div className="h-10 bg-gray-300 rounded w-16"></div>
              <div className="h-10 bg-gray-300 rounded w-16"></div>
            </div>
          </div>

          <div className="flex space-x-4">
            <div className="h-12 bg-gray-300 rounded flex-1"></div>
            <div className="h-12 bg-gray-300 rounded flex-1"></div>
          </div>
        </div>
      </div>
    </div>
  );
}