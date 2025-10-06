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
  },
  {
    name: 'Total Orders',
    value: (stats: any) => stats.totalOrders.toLocaleString(),
    icon: ShoppingCartIcon,
    color: 'bg-blue-500',
  },
  {
    name: 'Total Products',
    value: (stats: any) => stats.totalProducts.toLocaleString(),
    icon: CubeIcon,
    color: 'bg-purple-500',
  },
  {
    name: 'Total Users',
    value: (stats: any) => stats.totalUsers.toLocaleString(),
    icon: UserGroupIcon,
    color: 'bg-orange-500',
  },
];

export default function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((card) => (
        <div
          key={card.name}
          className="bg-white rounded-lg shadow-sm border p-6"
        >
          <div className="flex items-center">
            <div className={`flex-shrink-0 p-3 rounded-lg ${card.color}`}>
              <card.icon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{card.name}</p>
              <p className="text-2xl font-semibold text-gray-900">
                {card.value(stats)}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}