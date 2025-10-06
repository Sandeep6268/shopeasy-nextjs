// app/api/categories/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';

export async function GET() {
  try {
    await dbConnect();

    // Get categories with product counts and sample images
    const categories = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          sampleImage: { $first: '$images' } // Get first image from first product in category
        }
      },
      {
        $project: {
          name: '$_id',
          count: 1,
          image: { $arrayElemAt: ['$sampleImage', 0] }, // Get first image from array
          _id: 0
        }
      },
      {
        $sort: { count: -1 } // Sort by product count descending
      }
    ]);

    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Categories fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}