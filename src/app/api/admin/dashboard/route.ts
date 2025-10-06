// app/api/admin/dashboard/route.ts - UPDATED
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import dbConnect from '@/lib/mongodb';
import { validateAuthToken } from '@/lib/auth';
import User from '@/models/User';
import Order from '@/models/Order';
import Product from '@/models/Product';

async function getTokenFromHeaders(): Promise<string | null> {
  try {
    const headersList = await headers();
    const cookieHeader = headersList.get('cookie');
    if (!cookieHeader) return null;
    
    const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
      const [name, value] = cookie.trim().split('=');
      acc[name] = value;
      return acc;
    }, {} as Record<string, string>);
    
    return cookies.token || null;
  } catch (error) {
    return null;
  }
}

export async function GET() {
  try {
    await dbConnect();

    const token = await getTokenFromHeaders();
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const payload = validateAuthToken(token);
    
    // Verify admin access
    const user = await User.findById(payload.userId);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Get dashboard statistics
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();
    
    // Calculate total sales
    const salesResult = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalSales: { $sum: '$total' }
        }
      }
    ]);
    const totalSales = salesResult[0]?.totalSales || 0;

    // Get recent orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('orderNumber total status createdAt shippingInfo')
      .lean();

    // Get popular products (products with highest inventory movement)
    const popularProducts = await Product.find()
      .sort({ inventory: -1 }) // Sort by inventory to get popular ones
      .limit(5)
      .select('name price images inventory rating')
      .lean();

    return NextResponse.json({
      totalSales,
      totalOrders,
      totalProducts,
      totalUsers,
      recentOrders: recentOrders.map(order => ({
        ...order,
        _id: order._id.toString()
      })),
      popularProducts: popularProducts.map(product => ({
        id: product._id.toString(),
        name: product.name,
        price: product.price,
        image: product.images?.[0] || '/placeholder-product.jpg',
        salesCount: Math.floor(Math.random() * 100) + 10, // Mock for now
        rating: product.rating || 4.5
      }))
    });
  } catch (error) {
    console.error('Dashboard data fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}