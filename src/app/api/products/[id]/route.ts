// app/api/products/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const product = await Product.findById(params.id).select('-__v').lean();

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Transform the product data
    const transformedProduct = {
      id: product._id?.toString(),
      name: product.name,
      description: product.description,
      price: product.price,
      comparePrice: product.comparePrice,
      images: product.images || [],
      category: product.category,
      tags: product.tags || [],
      inventory: product.inventory || 0,
      rating: product.rating || 0,
      reviewCount: product.reviewCount || 0,
      featured: product.featured || false,
      status: product.status || 'active',
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };

    return NextResponse.json({ product: transformedProduct });
  } catch (error) {
    console.error('Product fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}