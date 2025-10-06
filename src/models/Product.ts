// models/Product.ts
import mongoose, { Document, Schema } from 'mongoose';
import { IProduct } from '@/types/product';

export interface IProductDocument extends IProduct, Document {}

const productSchema = new Schema<IProductDocument>({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxLength: [100, 'Product name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxLength: [2000, 'Description cannot exceed 2000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  comparePrice: {
    type: Number,
    min: [0, 'Compare price cannot be negative']
  },
  images: [{
    type: String,
    required: [true, 'At least one product image is required']
  }],
  category: {
    type: String,
    required: [true, 'Product category is required'],
    enum: ['electronics', 'clothing', 'books', 'home', 'beauty', 'sports', 'other']
  },
  tags: [{
    type: String,
    trim: true
  }],
  inventory: {
    type: Number,
    required: [true, 'Product inventory is required'],
    min: [0, 'Inventory cannot be negative'],
    default: 0
  },
  rating: {
    type: Number,
    min: [0, 'Rating cannot be less than 0'],
    max: [5, 'Rating cannot be more than 5'],
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'draft'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Index for better search performance
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ featured: 1 });
productSchema.index({ status: 1 });

export default mongoose.models.Product || mongoose.model<IProductDocument>('Product', productSchema);