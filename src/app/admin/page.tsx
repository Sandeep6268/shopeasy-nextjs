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
      <div className="flex min-h-screen">
        <AdminSidebar />
        <div className="flex-1 p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-300 rounded"></div>
              ))}
            </div>
            <div className="h-96 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome to your admin dashboard</p>
        </div>

        {stats && (
          <>
            <StatsCards stats={stats} />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
              <RecentOrders orders={stats.recentOrders} />
              <PopularProducts products={stats.popularProducts} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}