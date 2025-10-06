'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function CheckoutSuccessPage() {
  const { user } = useAuth();

  useEffect(() => {
    // Track conversion or send confirmation email in a real app
    // //console.log('Purchase completed for user:', user?.email);
  }, [user]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center">
      <div className="bg-white rounded-lg shadow-sm border p-8">
        <div className="text-green-500 mb-6">
          <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Confirmed!</h1>
        <p className="text-gray-600 mb-2">Thank you for your purchase.</p>
        <p className="text-gray-600 mb-8">
          Your order has been successfully placed. You will receive a confirmation email shortly.
        </p>

        <div className="bg-gray-50 p-6 rounded-lg mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">What's Next?</h2>
          <ul className="text-gray-600 text-left space-y-2">
            <li>• You will receive an order confirmation email</li>
            <li>• We'll notify you when your order ships</li>
            <li>• Estimated delivery: 3-5 business days</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/orders"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
          >
            View My Orders
          </Link>
          <Link
            href="/products"
            className="bg-gray-200 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition duration-300"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}