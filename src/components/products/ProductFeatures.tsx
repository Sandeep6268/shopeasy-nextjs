interface ProductFeaturesProps {
  features: string[];
}

export default function ProductFeatures({ features }: ProductFeaturesProps) {
  return (
    <div className="border-t pt-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Features</h3>
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <svg
              className="w-5 h-5 text-green-500 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}