// components/admin/OrderDetails.tsx
'use client';

import { useState } from 'react';
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

interface OrderDetailsProps {
  order: Order;
  onStatusUpdate: (status: string) => void;
  onAddNote: (note: string) => void;
  updating: boolean;
}

const statusOptions = [
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'refunded'
];

const statusColors: { [key: string]: string } = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-purple-100 text-purple-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  refunded: 'bg-gray-100 text-gray-800',
};

export default function OrderDetails({ order, onStatusUpdate, onAddNote, updating }: OrderDetailsProps) {
  const [newNote, setNewNote] = useState('');

  const handleAddNote = () => {
    if (newNote.trim()) {
      onAddNote(newNote.trim());
      setNewNote('');
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

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Order #{order.orderNumber}</h1>
          <p className="text-gray-600 mt-2">Placed on {formatDate(order.createdAt)}</p>
        </div>
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          <Link
            href={`/admin/orders/${order._id}/edit`}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Edit Order
          </Link>
          <Link
            href="/admin/orders"
            className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Back to Orders
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Order Items */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center space-x-4 py-4 border-b border-gray-100 last:border-0">
                  <img
                    src={item.product.images[0] || '/placeholder-product.jpg'}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.product.name}</h3>
                    <p className="text-gray-600 text-sm">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">${item.price}</p>
                    <p className="text-gray-600 text-sm">${item.product.price} each</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center pt-4 mt-4 border-t border-gray-200">
              <span className="text-lg font-semibold text-gray-900">Total</span>
              <span className="text-2xl font-bold text-gray-900">${order.total}</span>
            </div>
          </div>

          {/* Order Notes */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Notes</h2>
            <div className="space-y-4">
              <div className="flex space-x-4">
                <input
                  type="text"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add a note about this order..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleAddNote}
                  disabled={!newNote.trim()}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Note
                </button>
              </div>
              {order.notes && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700">{order.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Status */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Status</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status]}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
              <select
                value={order.status}
                onChange={(e) => onStatusUpdate(e.target.value)}
                disabled={updating}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
              {updating && (
                <p className="text-sm text-blue-600">Updating status...</p>
              )}
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Customer Information</h2>
            <div className="space-y-3">
              <div>
                <p className="font-medium text-gray-900">
                  {order.shippingInfo.firstName} {order.shippingInfo.lastName}
                </p>
                <p className="text-gray-600">{order.shippingInfo.email}</p>
                <p className="text-gray-600">{order.shippingInfo.phone}</p>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Shipping Address</h2>
            <div className="text-gray-600 space-y-1">
              <p>{order.shippingInfo.address}</p>
              <p>
                {order.shippingInfo.city}, {order.shippingInfo.state} {order.shippingInfo.zipCode}
              </p>
              <p>{order.shippingInfo.country}</p>
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Information</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Method:</span>
                <span className="font-medium">{order.paymentInfo.method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  order.paymentInfo.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {order.paymentInfo.status}
                </span>
              </div>
              {order.paymentInfo.transactionId && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Transaction ID:</span>
                  <span className="font-medium text-sm">{order.paymentInfo.transactionId}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}