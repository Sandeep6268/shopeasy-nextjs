// app/api/products/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';

export async function GET(request: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search') || '';
    const maxPrice = searchParams.get('maxPrice');
    const inStock = searchParams.get('inStock');
    const limit = parseInt(searchParams.get('limit') || '12');
    const page = parseInt(searchParams.get('page') || '1');

    const skip = (page - 1) * limit;

    // Build filter object
    const filter: any = { status: 'active' };
    
    // Category filter
    if (category) {
      const categories = category.split(',');
      filter.category = { $in: categories };
    }
    
    // Price filter
    if (maxPrice) {
      filter.price = { $lte: parseFloat(maxPrice) };
    }
    
    // Stock filter
    if (inStock === 'true') {
      filter.inventory = { $gt: 0 };
    }
    
    // Search filter
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Fetch products from MongoDB
    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-__v')
      .lean();

    const total = await Product.countDocuments(filter);

    return NextResponse.json({
      products: products.map(product => ({
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
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      filters: {
        category,
        maxPrice,
        inStock,
        search
      }
    });
  } catch (error) {
    console.error('Products fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}