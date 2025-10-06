import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  title: {
    type: String,
    required: true,
    maxlength: 100,
  },
  comment: {
    type: String,
    required: true,
    maxlength: 1000,
  },
  verifiedPurchase: {
    type: Boolean,
    default: false,
  },
  helpful: {
    type: Number,
    default: 0,
  },
  notHelpful: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// Compound index for unique user reviews per product
ReviewSchema.index({ productId: 1, userId: 1 }, { unique: true });

export default mongoose.models.Review || mongoose.model('Review', ReviewSchema);