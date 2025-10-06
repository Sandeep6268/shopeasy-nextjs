export default function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
          <div className="h-64 bg-gray-300"></div>
          <div className="p-4 space-y-3">
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-3 bg-gray-300 rounded w-full"></div>
            <div className="h-3 bg-gray-300 rounded w-2/3"></div>
            <div className="flex justify-between items-center">
              <div className="h-6 bg-gray-300 rounded w-1/4"></div>
              <div className="h-8 bg-gray-300 rounded w-1/3"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}