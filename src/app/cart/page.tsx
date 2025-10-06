// app/cart/page.tsx - RESPONSIVE FOR MOBILE
'use client';

import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function CartPage() {
  const { cart, removeItem, updateQuantity, clearCart, isLoading } = useCart();

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center min-h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">Looks like you haven't added any items to your cart yet.</p>
          <Link
            href="/products"
            className="inline-flex items-center bg-blue-600 text-white px-6 sm:px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 space-y-4 sm:space-y-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Shopping Cart</h1>
        <div className="flex items-center space-x-4">
          <span className="text-sm sm:text-base text-gray-600">
            {cart.itemCount} item{cart.itemCount !== 1 ? 's' : ''}
          </span>
          <button
            onClick={clearCart}
            className="text-red-600 hover:text-red-800 font-medium text-sm sm:text-base"
          >
            Clear Cart
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Cart Items - Mobile Optimized */}
        <div className="lg:col-span-2 space-y-3 sm:space-y-4">
          {cart.items.map((item) => (
            <div key={item.product.id} className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
              {/* Mobile Layout */}
              <div className="sm:hidden">
                {/* Product Image and Basic Info */}
                <div className="flex space-x-3 mb-3">
                  <div className="relative w-16 h-16 flex-shrink-0">
                    {item.product.images && item.product.images.length > 0 ? (
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className="object-cover rounded-lg"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder-product.jpg';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-gray-400 text-xs">No Image</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-grow min-w-0">
                    <h3 className="text-base font-semibold text-gray-900 truncate">{item.product.name}</h3>
                    <p className="text-gray-600 text-sm">${item.product.price}</p>
                    {item.product.inventory !== undefined && (
                      <p className={`text-xs ${
                        item.product.inventory > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {item.product.inventory > 0 ? 'In Stock' : 'Out of Stock'}
                      </p>
                    )}
                  </div>
                </div>

                {/* Quantity Controls and Price - Mobile */}
                <div className="flex items-center justify-between border-t pt-3">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600"
                    >
                      −
                    </button>
                    <span className="w-8 text-center font-medium text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      disabled={item.product.inventory !== undefined && item.quantity >= item.product.inventory}
                      className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600"
                    >
                      +
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="text-base font-semibold text-gray-900">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="text-red-600 hover:text-red-800 text-xs mt-1"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>

              {/* Desktop Layout */}
              <div className="hidden sm:flex items-center space-x-4">
                <div className="relative w-20 h-20 flex-shrink-0">
                  {item.product.images && item.product.images.length > 0 ? (
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fill
                      className="object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder-product.jpg';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-gray-400 text-xs">No Image</span>
                    </div>
                  )}
                </div>
                
                <div className="flex-grow min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">{item.product.name}</h3>
                  <p className="text-gray-600">${item.product.price}</p>
                  {item.product.inventory !== undefined && (
                    <p className={`text-sm ${
                      item.product.inventory > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {item.product.inventory > 0 ? 'In Stock' : 'Out of Stock'}
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-medium text-sm">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    disabled={item.product.inventory !== undefined && item.quantity >= item.product.inventory}
                    className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600"
                  >
                    +
                  </button>
                </div>

                <div className="text-right min-w-20">
                  <p className="text-lg font-semibold text-gray-900">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </p>
                  <button
                    onClick={() => removeItem(item.product.id)}
                    className="text-red-600 hover:text-red-800 text-sm mt-1"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary - Mobile Optimized */}
        <div className="lg:col-span-1">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border sticky top-4 sm:top-8">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-2 sm:space-y-3 mb-4">
              <div className="flex justify-between text-sm sm:text-base">
                <span className="text-gray-600">Items ({cart.itemCount})</span>
                <span className="font-medium">${cart.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm sm:text-base">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium text-green-600">FREE</span>
              </div>
              <div className="flex justify-between text-sm sm:text-base">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">${(cart.total * 0.1).toFixed(2)}</span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-3 sm:pt-4 mb-4 sm:mb-6">
              <div className="flex justify-between text-base sm:text-lg font-semibold">
                <span>Total</span>
                <span className="text-blue-600">${(cart.total * 1.1).toFixed(2)}</span>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Including taxes and shipping
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Link
                href="/checkout"
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 text-center block flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Proceed to Checkout
              </Link>

              <Link
                href="/products"
                className="w-full bg-gray-100 text-gray-900 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 transition duration-300 text-center block flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Continue Shopping
              </Link>
            </div>

            {/* Trust Badges - Mobile */}
            <div className="mt-4 sm:mt-6 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="text-center">
                  <div className="mx-auto w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mb-1">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <span className="text-xs text-gray-600">Secure</span>
                </div>
                <div className="text-center">
                  <div className="mx-auto w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mb-1">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <span className="text-xs text-gray-600">Free Shipping</span>
                </div>
                <div className="text-center">
                  <div className="mx-auto w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mb-1">
                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                  <span className="text-xs text-gray-600">Easy Returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}