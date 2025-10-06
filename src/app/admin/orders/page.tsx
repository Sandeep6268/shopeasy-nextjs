'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import OrdersTable from '@/components/admin/OrdersTable';

interface Order {
  _id: string;
  orderNumber: string;
  total: number;
  status: string;
  createdAt: string;
  shippingInfo: {
    firstName: string;
    lastName: string;
    email: string;
  };
  items: Array<{
    product: {
      name: string;
    };
    quantity: number;
  }>;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/admin/orders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        // Refresh orders list
        fetchOrders();
      }
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-600 mt-2">Manage customer orders</p>
        </div>

        <OrdersTable 
          orders={orders} 
          loading={loading}
          onStatusUpdate={updateOrderStatus}
        />
      </div>
    </div>
  );
}