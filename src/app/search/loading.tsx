import ProductGridSkeleton from '@/components/products/ProductGridSkeleton';

export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="h-8 bg-gray-300 rounded w-1/3 mb-4 animate-pulse"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2 animate-pulse"></div>
      </div>
      <ProductGridSkeleton />
    </div>
  );
}