import Link from 'next/link';

interface Order {
  _id: string;
  orderNumber: string;
  total: number;
  status: string;
  createdAt: string;
  shippingInfo: {
    firstName: string;
    lastName: string;
  };
}

interface RecentOrdersProps {
  orders: Order[];
}

export default function RecentOrders({ orders }: RecentOrdersProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
        <Link
          href="/admin/orders"
          className="text-sm text-blue-600 hover:text-blue-500 font-medium"
        >
          View all
        </Link>
      </div>

      <div className="space-y-4">
        {orders.length > 0 ? (
          orders.map((order) => (
            <div
              key={order._id}
              className="flex items-center justify-between py-3 border-b border-gray-200 last:border-0"
            >
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium text-gray-900">
                    #{order.orderNumber}
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    ${order.total.toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>
                    {order.shippingInfo.firstName} {order.shippingInfo.lastName}
                  </span>
                  <span>{formatDate(order.createdAt)}</span>
                </div>
                <div className="mt-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No recent orders</p>
          </div>
        )}
      </div>
    </div>
  );
}