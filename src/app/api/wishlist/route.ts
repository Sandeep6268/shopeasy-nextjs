import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Product from '@/models/Product';
import jwt from 'jsonwebtoken';

// SIMPLE TOKEN VALIDATION
function validateToken(token: string) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
    return decoded;
  } catch (error) {
    console.error('❌ [TOKEN] Validation failed:', error);
    return null;
  }
}

// Helper function to get token from cookies
async function getTokenFromHeaders(): Promise<string | null> {
  try {
    const headersList = await headers();
    const cookieHeader = headersList.get('cookie');
    
    if (!cookieHeader) {
      return null;
    }
    
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

// GET - Get user's wishlist from MongoDB
export async function GET() {
  try {
    await dbConnect();

    const token = await getTokenFromHeaders();

    if (!token) {
      return NextResponse.json({ wishlist: [] });
    }

    const payload = validateToken(token);
    
    if (!payload) {
      return NextResponse.json({ wishlist: [] });
    }

    const user = await User.findById(payload.userId);
    
    if (!user) {
      return NextResponse.json({ wishlist: [] });
    }

    // Get products from MongoDB based on wishlist IDs
    const wishlistProductIds = Array.isArray(user.wishlist) ? user.wishlist : [];
    
    if (wishlistProductIds.length === 0) {
      return NextResponse.json({ 
        wishlist: [],
        success: true 
      });
    }
    
    // MongoDB se products fetch karein
    const wishlistProducts = await Product.find({
      _id: { $in: wishlistProductIds }
    }).select('name price images category inventory description featured rating reviewCount comparePrice');

    // Convert MongoDB documents to plain objects with id field
    const formattedProducts = wishlistProducts.map(product => ({
      id: product._id.toString(),
      name: product.name,
      price: product.price,
      images: product.images || [],
      category: product.category,
      inStock: (product.inventory || 0) > 0,
      inventory: product.inventory || 0,
      description: product.description,
      featured: product.featured || false,
      rating: product.rating || 0,
      reviewCount: product.reviewCount || 0,
      comparePrice: product.comparePrice
    }));

    return NextResponse.json({ 
      wishlist: formattedProducts,
      success: true 
    });
  } catch (error: any) {
    console.error('❌ [WISHLIST GET] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch wishlist' },
      { status: 500 }
    );
  }
}

// POST - Add to wishlist
export async function POST(request: Request) {
  try {
    await dbConnect();

    const token = await getTokenFromHeaders();

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const payload = validateToken(token);
    
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const { productId } = await request.json();

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Find user by ID from token
    const user = await User.findById(payload.userId);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Initialize wishlist if not exists
    if (!user.wishlist) {
      user.wishlist = [];
    }

    // Add product to wishlist if not already there
    if (!user.wishlist.includes(productId)) {
      user.wishlist.push(productId);
      await user.save();
    }

    // Return updated wishlist with products from MongoDB
    const wishlistProductIds = Array.isArray(user.wishlist) ? user.wishlist : [];
    
    const wishlistProducts = await Product.find({
      _id: { $in: wishlistProductIds }
    }).select('name price images category inventory description featured rating reviewCount comparePrice');

    // Convert to proper format
    const formattedProducts = wishlistProducts.map(product => ({
      id: product._id.toString(),
      name: product.name,
      price: product.price,
      images: product.images || [],
      category: product.category,
      inStock: (product.inventory || 0) > 0,
      inventory: product.inventory || 0,
      description: product.description,
      featured: product.featured || false,
      rating: product.rating || 0,
      reviewCount: product.reviewCount || 0,
      comparePrice: product.comparePrice
    }));

    return NextResponse.json({ 
      message: 'Added to wishlist',
      wishlist: formattedProducts,
      success: true
    });
  } catch (error: any) {
    console.error('❌ [WISHLIST POST] Error:', error);
    return NextResponse.json(
      { error: 'Failed to add to wishlist' },
      { status: 500 }
    );
  }
}

// DELETE - Remove from wishlist
export async function DELETE(request: Request) {
  try {
    await dbConnect();

    const token = await getTokenFromHeaders();

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const payload = validateToken(token);
    
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const { productId } = await request.json();

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const user = await User.findById(payload.userId);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Remove product from wishlist
    if (user.wishlist && Array.isArray(user.wishlist)) {
      user.wishlist = user.wishlist.filter(id => id !== productId);
      await user.save();
    }

    // Return updated wishlist
    const wishlistProductIds = Array.isArray(user.wishlist) ? user.wishlist : [];
    
    const wishlistProducts = await Product.find({
      _id: { $in: wishlistProductIds }
    }).select('name price images category inventory description featured rating reviewCount comparePrice');

    const formattedProducts = wishlistProducts.map(product => ({
      id: product._id.toString(),
      name: product.name,
      price: product.price,
      images: product.images || [],
      category: product.category,
      inStock: (product.inventory || 0) > 0,
      inventory: product.inventory || 0,
      description: product.description,
      featured: product.featured || false,
      rating: product.rating || 0,
      reviewCount: product.reviewCount || 0,
      comparePrice: product.comparePrice
    }));

    return NextResponse.json({ 
      message: 'Removed from wishlist',
      wishlist: formattedProducts,
      success: true
    });
  } catch (error: any) {
    console.error('Wishlist remove error:', error);
    return NextResponse.json(
      { error: 'Failed to remove from wishlist' },
      { status: 500 }
    );
  }
}