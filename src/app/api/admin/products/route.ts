// app/api/admin/products/route.ts - UPDATED
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import dbConnect from '@/lib/mongodb';
import { validateAuthToken } from '@/lib/auth';
import User from '@/models/User';
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

// GET - Fetch products with pagination and filtering
export async function GET(request: Request) {
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

    // Get query parameters for pagination/filtering
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const status = searchParams.get('status') || '';

    const skip = (page - 1) * limit;

    // Build filter object
    const filter: any = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    if (category) filter.category = category;
    if (status) filter.status = status;

    // Fetch products from MongoDB with pagination
    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-__v')
      .lean();

    const total = await Product.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      products: products.map(product => ({
        id: product._id.toString(),
        name: product.name,
        description: product.description,
        price: product.price,
        comparePrice: product.comparePrice,
        images: product.images,
        category: product.category,
        tags: product.tags,
        inventory: product.inventory,
        rating: product.rating,
        reviewCount: product.reviewCount,
        featured: product.featured,
        status: product.status,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
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

// POST - Create new product
export async function POST(request: Request) {
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

    const body = await request.json();

    // Validation
    if (!body.name || !body.description || !body.price || !body.images || body.images.length === 0 || !body.category) {
      return NextResponse.json(
        { error: 'Missing required fields: name, description, price, images, category are required' },
        { status: 400 }
      );
    }

    if (body.price < 0) {
      return NextResponse.json(
        { error: 'Price cannot be negative' },
        { status: 400 }
      );
    }

    if (body.inventory < 0) {
      return NextResponse.json(
        { error: 'Inventory cannot be negative' },
        { status: 400 }
      );
    }

    // Create product
    const productData = {
      name: body.name,
      description: body.description,
      price: parseFloat(body.price),
      comparePrice: body.comparePrice ? parseFloat(body.comparePrice) : undefined,
      images: body.images,
      category: body.category,
      tags: body.tags || [],
      inventory: parseInt(body.inventory) || 0,
      featured: Boolean(body.featured),
      status: body.status || 'draft'
    };

    const product = new Product(productData);
    await product.save();

    return NextResponse.json(
      { 
        message: 'Product created successfully', 
        product: {
          id: product._id.toString(),
          ...product.toObject()
        }
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Create product error:', error);
    
    // Handle MongoDB validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { error: 'Validation failed', details: errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}