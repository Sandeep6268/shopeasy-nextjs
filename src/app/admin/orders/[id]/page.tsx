// app/admin/orders/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import OrderDetails from '@/components/admin/OrderDetails';

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
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentInfo: {
    method: string;
    status: string;
    transactionId?: string;
  };
  items: Array<{
    product: {
      _id: string;
      name: string;
      price: number;
      images: string[];
    };
    quantity: number;
    price: number;
  }>;
  notes?: string;
}

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchOrder(params.id as string);
    }
  }, [params.id]);

  const fetchOrder = async (orderId: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`);
      if (response.ok) {
        const data = await response.json();
        setOrder(data.order);
      } else {
        console.error('Failed to fetch order');
      }
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (newStatus: string) => {
    if (!order) return;

    setUpdating(true);
    try {
      const response = await fetch(`/api/admin/orders/${order._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setOrder(prev => prev ? { ...prev, status: newStatus } : null);
      } else {
        console.error('Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order:', error);
    } finally {
      setUpdating(false);
    }
  };

  const addOrderNote = async (note: string) => {
    if (!order) return;

    try {
      const response = await fetch(`/api/admin/orders/${order._id}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ note }),
      });

      if (response.ok) {
        const data = await response.json();
        setOrder(data.order);
      }
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <AdminSidebar />
        <div className="flex-1 p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <div className="h-64 bg-gray-200 rounded"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
              <div className="space-y-4">
                <div className="h-48 bg-gray-200 rounded"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex min-h-screen">
        <AdminSidebar />
        <div className="flex-1 p-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h2>
            <p className="text-gray-600 mb-8">The order you're looking for doesn't exist.</p>
            <button
              onClick={() => router.push('/admin/orders')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Back to Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <OrderDetails
          order={order}
          onStatusUpdate={updateOrderStatus}
          onAddNote={addOrderNote}
          updating={updating}
        />
      </div>
    </div>
  );
}