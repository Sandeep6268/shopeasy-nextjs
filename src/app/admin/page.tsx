// app/admin/page.tsx - FIXED MOBILE SIDEBAR
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminSidebar from '@/components/admin/AdminSidebar';
import StatsCards from '@/components/admin/StatsCards';
import RecentOrders from '@/components/admin/RecentOrders';
import PopularProducts from '@/components/admin/PopularProducts';

interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  recentOrders: any[];
  popularProducts: any[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/admin/dashboard');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        {/* Desktop Sidebar - Hidden on Mobile */}
        <div className="hidden lg:block">
          <AdminSidebar />
        </div>
        
        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center justify-between mb-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
            <div className="w-6"></div> {/* Spacer for balance */}
          </div>

          <div className="animate-pulse">
            <div className="hidden lg:block">
              <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
            </div>
            
            {/* Stats Cards Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 sm:h-32 bg-gray-300 rounded-lg"></div>
              ))}
            </div>
            
            {/* Charts Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="h-80 sm:h-96 bg-gray-300 rounded-lg"></div>
              <div className="h-80 sm:h-96 bg-gray-300 rounded-lg"></div>
            </div>
          </div>
        </div>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)}></div>
            <div className="fixed left-0 top-0 bottom-0 w-64 bg-white shadow-xl">
              <AdminSidebar onClose={() => setSidebarOpen(false)} />
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop Sidebar - Hidden on Mobile */}
      <div className="hidden lg:block">
        <AdminSidebar />
      </div>
      
      <div className="flex-1 p-4 sm:p-6 lg:p-8">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between mb-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
          <div className="w-6"></div> {/* Spacer for balance */}
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:block mb-6 lg:mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1 lg:mt-2 text-sm lg:text-base">Welcome to your admin dashboard</p>
        </div>

        {stats && (
          <>
            {/* Stats Cards */}
            <div className="mb-6 lg:mb-8">
              <StatsCards stats={stats} />
            </div>
            
            {/* Charts Section */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              <RecentOrders orders={stats.recentOrders} />
              <PopularProducts products={stats.popularProducts} />
            </div>

            {/* Quick Actions - Mobile Only */}
            <div className="lg:hidden mt-6">
              <div className="bg-white rounded-lg shadow-sm border p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/admin/products"
                    className="bg-blue-50 text-blue-700 p-3 rounded-lg text-center font-medium hover:bg-blue-100 transition-colors"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <div className="flex flex-col items-center">
                      <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                      <span className="text-sm">Products</span>
                    </div>
                  </Link>
                  <Link
                    href="/admin/orders"
                    className="bg-green-50 text-green-700 p-3 rounded-lg text-center font-medium hover:bg-green-100 transition-colors"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <div className="flex flex-col items-center">
                      <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      <span className="text-sm">Orders</span>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50">
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" 
              onClick={() => setSidebarOpen(false)}
            ></div>
            <div className="fixed left-0 top-0 bottom-0 w-64 bg-white shadow-xl transform transition-transform">
              <AdminSidebar onClose={() => setSidebarOpen(false)} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}