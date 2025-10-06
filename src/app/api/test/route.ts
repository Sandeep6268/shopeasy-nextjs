// app/api/test/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import User from '@/models/User';
import Order from '@/models/Order';

export async function GET() {
  try {
    await dbConnect();
    
    const [productCount, userCount, orderCount] = await Promise.all([
      Product.countDocuments(),
      User.countDocuments(),
      Order.countDocuments()
    ]);

    return NextResponse.json({
      success: true,
      message: '✅ MongoDB Atlas Connection Successful!',
      database: process.env.MONGODB_DB_NAME,
      stats: {
        products: productCount,
        users: userCount,
        orders: orderCount
      },
      environment: process.env.NODE_ENV
    });
    
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: '❌ Database connection failed',
      message: error.message,
      MONGODB_URI: process.env.MONGODB_URI ? 'Set' : 'Not Set'
    }, { status: 500 });
  }
}