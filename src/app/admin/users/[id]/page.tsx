// app/admin/users/[id]/page.tsx - COMPLETE
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon, EnvelopeIcon, CalendarIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  ordersCount?: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  total: number;
  status: string;
  createdAt: string;
  items: Array<{
    product: {
      name: string;
      images?: string[];
    };
    quantity: number;
    price: number;
  }>;
}

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;
  
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const [userResponse, ordersResponse] = await Promise.all([
        fetch(`/api/admin/users/${userId}`),
        fetch(`/api/admin/users/${userId}/orders`)
      ]);

      if (!userResponse.ok) {
        throw new Error('Failed to fetch user data');
      }

      const userData = await userResponse.json();
      setUser(userData);

      if (ordersResponse.ok) {
        const ordersData = await ordersResponse.json();
        setOrders(ordersData.orders || []);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleUpdate = async (newRole: string) => {
    if (!user) return;

    setUpdating(true);
    const updateToast = toast.loading('Updating user role...');

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (response.ok) {
        setUser(prev => prev ? { ...prev, role: newRole } : null);
        toast.success('User role updated successfully', { id: updateToast });
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to update user role', { id: updateToast });
      }
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Failed to update user role', { id: updateToast });
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/users"
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Link>
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6 animate-pulse">
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/users"
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">User Not Found</h1>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
          <p className="text-gray-500">The user you're looking for doesn't exist.</p>
          <Link
            href="/admin/users"
            className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Back to Users
          </Link>
        </div>
      </div>
    );
  }

  const totalSpent = orders.reduce((total, order) => total + order.total, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/users"
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">User Details</h1>
            <p className="text-gray-600">Manage user information and orders</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Information */}
        <div className="lg:col-span-1 space-y-6">
          {/* Profile Card */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="text-center">
              <div className="mx-auto h-20 w-20 bg-blue-600 rounded-full flex items-center justify-center mb-4">
                <span className="text-white text-2xl font-medium">
                  {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                </span>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                {user.name || 'No Name'}
              </h2>
              <p className="text-gray-600 mb-4">{user.email}</p>
              
              <div className="flex items-center justify-center gap-2 mb-4">
                <select
                  value={user.role}
                  onChange={(e) => handleRoleUpdate(e.target.value)}
                  disabled={updating}
                  className={`text-sm font-medium rounded-full px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    user.role === 'admin' 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-gray-100 text-gray-800'
                  } ${updating ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
                {updating && (
                  <span className="text-sm text-gray-500">Updating...</span>
                )}
              </div>
            </div>

            <div className="space-y-3 mt-6">
              <div className="flex items-center text-sm text-gray-600">
                <EnvelopeIcon className="h-4 w-4 mr-2" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <CalendarIcon className="h-4 w-4 mr-2" />
                <span>Joined {formatDate(user.createdAt)}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <ShoppingBagIcon className="h-4 w-4 mr-2" />
                <span>{orders.length} total orders</span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Order Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Orders</span>
                <span className="text-sm font-medium text-gray-900">{orders.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Spent</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatCurrency(totalSpent)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Average Order</span>
                <span className="text-sm font-medium text-gray-900">
                  {orders.length > 0 ? formatCurrency(totalSpent / orders.length) : formatCurrency(0)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Orders History */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Order History</h3>
            </div>

            {orders.length === 0 ? (
              <div className="p-12 text-center">
                <ShoppingBagIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500 mb-2">No orders found</p>
                <p className="text-sm text-gray-400">This user hasn't placed any orders yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Items
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order) => (
                      <tr key={order._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            #{order.orderNumber}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatDate(order.createdAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {formatCurrency(order.total)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {order.items.length} items
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {order.items.slice(0, 2).map(item => item.product.name).join(', ')}
                            {order.items.length > 2 && ` and ${order.items.length - 2} more`}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}