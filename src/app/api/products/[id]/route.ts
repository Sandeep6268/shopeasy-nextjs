// app/api/products/[id]/route.ts - UPDATED
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const productId = params.id;

    console.log('🔍 Fetching product by ID:', productId);

    const product = await Product.findOne({ 
      $or: [
        { _id: productId },
        { id: productId }
      ],
      status: 'active'
    }).lean();

    if (!product) {
      console.log('❌ Product not found:', productId);
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    console.log('✅ Product found:', product.name);

    return NextResponse.json({
      success: true,
      product: {
        ...product,
        id: product._id?.toString() || product.id
      }
    });

  } catch (error: any) {
    console.error('💥 Product API error:', error.message);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch product',
        message: error.message 
      },
      { status: 500 }
    );
  }
}