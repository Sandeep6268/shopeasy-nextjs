import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import dbConnect from '@/lib/mongodb';
import { validateAuthToken } from '@/lib/auth';
import User from '@/models/User';
import { products } from '@/data/products';

// Helper function to get token from cookies
async function getTokenFromHeaders(): Promise<string | null> {
  try {
    const headersList = await headers();
    const cookieHeader = headersList.get('cookie');
    
    // //console.log('🔍 [WISHLIST] Raw cookie header:', cookieHeader);
    
    if (!cookieHeader) {
      // //console.log('❌ [WISHLIST] No cookie header found');
      return null;
    }
    
    const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
      const [name, value] = cookie.trim().split('=');
      acc[name] = value;
      return acc;
    }, {} as Record<string, string>);
    
    const token = cookies.token || null;
    // //console.log('🔍 [WISHLIST] Parsed token:', token ? `${token.substring(0, 20)}...` : 'null');
    
    return token;
  } catch (error) {
    console.error('❌ [WISHLIST] Error parsing cookies:', error);
    return null;
  }
}

// GET - Get user's wishlist
export async function GET() {
  // //console.log('🚀 [WISHLIST GET] API called');
  
  try {
    await dbConnect();
    // //console.log('✅ [WISHLIST GET] Database connected');

    const token = await getTokenFromHeaders();

    if (!token) {
      // //console.log('❌ [WISHLIST GET] No token found, returning empty wishlist');
      return NextResponse.json({ wishlist: [] }, { status: 200 });
    }

    try {
      // //console.log('🔍 [WISHLIST GET] Validating token...');
      const payload = validateAuthToken(token);
      // //console.log('✅ [WISHLIST GET] Token validated, user ID:', payload.userId);

      const user = await User.findById(payload.userId);
      if (!user) {
        // //console.log('❌ [WISHLIST GET] User not found in database');
        return NextResponse.json({ wishlist: [] }, { status: 200 });
      }

      // //console.log('✅ [WISHLIST GET] User found:', user.email);

      // Ensure wishlist exists and is an array
      const wishlistProductIds = Array.isArray(user.wishlist) ? user.wishlist : [];
      // //console.log('🔍 [WISHLIST GET] Wishlist product IDs:', wishlistProductIds);

      const wishlistProducts = products.filter(product => 
        wishlistProductIds.includes(product.id)
      );

      // //console.log('✅ [WISHLIST GET] Returning wishlist with', wishlistProducts.length, 'items');
      return NextResponse.json({ wishlist: wishlistProducts });
    } catch (tokenError) {
      console.error('❌ [WISHLIST GET] Token validation failed:', tokenError);
      return NextResponse.json({ wishlist: [] }, { status: 200 });
    }
  } catch (error) {
    console.error('❌ [WISHLIST GET] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch wishlist' },
      { status: 500 }
    );
  }
}

// POST - Add to wishlist
export async function POST(request: Request) {
  // //console.log('🚀 [WISHLIST ADD] API called');
  
  try {
    await dbConnect();
    // //console.log('✅ [WISHLIST ADD] Database connected');

    const token = await getTokenFromHeaders();

    if (!token) {
      // //console.log('❌ [WISHLIST ADD] No token found');
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const payload = validateAuthToken(token);
    // //console.log('✅ [WISHLIST ADD] Token validated, user ID:', payload.userId);

    const { productId } = await request.json();
    // //console.log('🔍 [WISHLIST ADD] Product ID:', productId);

    if (!productId) {
      // //console.log('❌ [WISHLIST ADD] No product ID provided');
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const user = await User.findById(payload.userId);
    if (!user) {
      // //console.log('❌ [WISHLIST ADD] User not found in database');
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // //console.log('✅ [WISHLIST ADD] User found:', user.email);

    // Initialize wishlist if it doesn't exist
    if (!user.wishlist) {
      // //console.log('🔍 [WISHLIST ADD] Initializing empty wishlist');
      user.wishlist = [];
    }

    // //console.log('🔍 [WISHLIST ADD] Current wishlist:', user.wishlist);

    // Add product to wishlist if not already there
    if (!user.wishlist.includes(productId)) {
      user.wishlist.push(productId);
      await user.save();
      // //console.log('✅ [WISHLIST ADD] Product added to wishlist');
    } else {
      // //console.log('ℹ️ [WISHLIST ADD] Product already in wishlist');
    }

    return NextResponse.json({ 
      message: 'Added to wishlist',
      wishlist: user.wishlist 
    });
  } catch (error: any) {
    console.error('❌ [WISHLIST ADD] Error details:', error);
    return NextResponse.json(
      { error: `Internal server error: ${error.message}` },
      { status: 500 }
    );
  }
}

// DELETE - Remove from wishlist
export async function DELETE(request: Request) {
  // //console.log('🚀 [WISHLIST DELETE] API called');
  
  try {
    await dbConnect();

    const token = await getTokenFromHeaders();

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const payload = validateAuthToken(token);
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

    // Initialize wishlist if it doesn't exist
    if (!user.wishlist) {
      user.wishlist = [];
    }

    // Remove product from wishlist
    user.wishlist = user.wishlist.filter((id: string) => id !== productId);
    await user.save();

    return NextResponse.json({ 
      message: 'Removed from wishlist',
      wishlist: user.wishlist 
    });
  } catch (error: any) {
    console.error('Wishlist remove error:', error);
    return NextResponse.json(
      { error: `Internal server error: ${error.message}` },
      { status: 500 }
    );
  }
}