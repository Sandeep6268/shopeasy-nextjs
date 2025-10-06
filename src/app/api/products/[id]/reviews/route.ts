// app/api/products/[id]/reviews/route.ts
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import dbConnect from '@/lib/mongodb';
import { validateAuthToken } from '@/lib/auth';
import Review from '@/models/Review';
import User from '@/models/User';
import Product from '@/models/Product'; // Import Product model

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

// GET - Get reviews for a product
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const productId = params.id;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const sort = searchParams.get('sort') || 'newest';

    const skip = (page - 1) * limit;

    // Build sort object
    let sortOptions = {};
    switch (sort) {
      case 'newest':
        sortOptions = { createdAt: -1 };
        break;
      case 'oldest':
        sortOptions = { createdAt: 1 };
        break;
      case 'highest':
        sortOptions = { rating: -1, createdAt: -1 };
        break;
      case 'lowest':
        sortOptions = { rating: 1, createdAt: -1 };
        break;
      case 'helpful':
        sortOptions = { helpful: -1, createdAt: -1 };
        break;
      default:
        sortOptions = { createdAt: -1 };
    }

    const reviews = await Review.find({ productId })
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    const totalReviews = await Review.countDocuments({ productId });
    
    // Also get product details to ensure rating is synced
    const product = await Product.findById(productId);
    
    const averageRating = await Review.aggregate([
      { $match: { productId } },
      { $group: { _id: null, average: { $avg: '$rating' } } }
    ]);

    const ratingDistribution = await Review.aggregate([
      { $match: { productId } },
      { $group: { _id: '$rating', count: { $sum: 1 } } },
      { $sort: { _id: -1 } }
    ]);

    return NextResponse.json({
      reviews,
      pagination: {
        page,
        limit,
        totalReviews,
        totalPages: Math.ceil(totalReviews / limit),
      },
      summary: {
        averageRating: averageRating[0]?.average || product?.rating || 0,
        totalReviews,
        ratingDistribution,
        productRating: product?.rating || 0,
        productReviewCount: product?.reviewCount || 0
      }
    });
  } catch (error) {
    console.error('Reviews fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

// POST - Create a new review AND update product rating
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
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
    const productId = params.id;
    
    const { rating, title, comment } = await request.json();

    // Validate input
    if (!rating || !title || !comment) {
      return NextResponse.json(
        { error: 'Rating, title, and comment are required' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Get user info
    const user = await User.findById(payload.userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      productId,
      userId: payload.userId
    });

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this product' },
        { status: 400 }
      );
    }

    // Check if user purchased the product (for verified purchase badge)
    const hasPurchased = false; // Implement purchase verification logic

    // Create review
    const review = await Review.create({
      productId,
      userId: payload.userId,
      userName: user.name || user.email.split('@')[0],
      userEmail: user.email,
      rating,
      title,
      comment,
      verifiedPurchase: hasPurchased,
    });

    // ✅ CRITICAL: Update product rating and review count
    const allReviews = await Review.find({ productId });
    const totalRating = allReviews.reduce((sum, rev) => sum + rev.rating, 0);
    const averageRating = totalRating / allReviews.length;
    
    // Update the product
    await Product.findByIdAndUpdate(productId, {
      rating: parseFloat(averageRating.toFixed(1)),
      reviewCount: allReviews.length
    });

    return NextResponse.json({
      message: 'Review submitted successfully',
      review,
      updatedProduct: {
        rating: parseFloat(averageRating.toFixed(1)),
        reviewCount: allReviews.length
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Review creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    );
  }
}