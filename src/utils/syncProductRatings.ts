// utils/syncProductRatings.ts
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import Review from '@/models/Review';

export async function syncProductRatings() {
  try {
    await dbConnect();
    
    const products = await Product.find({});
    
    for (const product of products) {
      const reviews = await Review.find({ productId: product._id.toString() });
      
      if (reviews.length > 0) {
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = totalRating / reviews.length;
        
        await Product.findByIdAndUpdate(product._id, {
          rating: parseFloat(averageRating.toFixed(1)),
          reviewCount: reviews.length
        });
        
        console.log(`Updated product ${product.name}: ${averageRating.toFixed(1)} stars, ${reviews.length} reviews`);
      }
    }
    
    console.log('Product ratings sync completed');
  } catch (error) {
    console.error('Sync error:', error);
  }
}

// Run this once to fix existing data
// syncProductRatings();