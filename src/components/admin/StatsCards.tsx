// components/admin/StatsCards.tsx - RESPONSIVE FOR MOBILE
import {
  ShoppingCartIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  CubeIcon,
} from '@heroicons/react/24/outline';

interface StatsCardsProps {
  stats: {
    totalSales: number;
    totalOrders: number;
    totalProducts: number;
    totalUsers: number;
  };
}

const statCards = [
  {
    name: 'Total Sales',
    value: (stats: any) => `$${stats.totalSales.toLocaleString()}`,
    icon: CurrencyDollarIcon,
    color: 'bg-green-500',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    description: 'Total revenue generated'
  },
  {
    name: 'Total Orders',
    value: (stats: any) => stats.totalOrders.toLocaleString(),
    icon: ShoppingCartIcon,
    color: 'bg-blue-500',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    description: 'All-time orders'
  },
  {
    name: 'Total Products',
    value: (stats: any) => stats.totalProducts.toLocaleString(),
    icon: CubeIcon,
    color: 'bg-purple-500',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    description: 'Active products'
  },
  {
    name: 'Total Users',
    value: (stats: any) => stats.totalUsers.toLocaleString(),
    icon: UserGroupIcon,
    color: 'bg-orange-500',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    description: 'Registered users'
  },
];

export default function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {statCards.map((card) => (
        <div
          key={card.name}
          className="bg-white rounded-xl shadow-sm border p-4 sm:p-6 hover:shadow-md transition-shadow duration-200"
        >
          {/* Mobile Layout */}
          <div className="sm:hidden">
            <div className="flex items-center justify-between mb-3">
              <div className={`flex-shrink-0 p-2 rounded-lg ${card.color}`}>
                <card.icon className="h-4 w-4 text-white" />
              </div>
              <div className="text-right">
                <p className="text-lg sm:text-xl font-bold text-gray-900">
                  {card.value(stats)}
                </p>
                <p className="text-xs text-gray-500">{card.description}</p>
              </div>
            </div>
            <p className="text-sm font-medium text-gray-700 truncate">{card.name}</p>
          </div>

          {/* Desktop Layout */}
          <div className="hidden sm:block">
            <div className="flex items-center">
              <div className={`flex-shrink-0 p-3 rounded-xl ${card.color}`}>
                <card.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4 min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-600 truncate">{card.name}</p>
                <p className="text-2xl font-bold text-gray-900 truncate">
                  {card.value(stats)}
                </p>
                <p className="text-xs text-gray-500 mt-1 truncate">
                  {card.description}
                </p>
              </div>
            </div>
          </div>

          {/* Trend Indicator - Optional */}
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Last 30 days</span>
              <span className="flex items-center text-green-600 font-medium">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                +12%
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}