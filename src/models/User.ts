// models/User.ts - UPDATED
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const CartItemSchema = new mongoose.Schema({
  product: {
    id: String,
    name: String,
    price: Number,
    images: [String],
    inStock: Boolean,
    inventory: Number,
    category: String,
  },
  quantity: {
    type: Number,
    default: 1,
    min: 1,
  },
});

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  image: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  wishlist: {
    type: [String],
    default: [],
  },
  cart: {
    items: [CartItemSchema],
    total: {
      type: Number,
      default: 0,
    },
    itemCount: {
      type: Number,
      default: 0,
    },
  },
  resetToken: {
    type: String,
    required: false,
  },
  resetTokenExpiry: {
    type: Date,
    required: false,
  },
}, {
  timestamps: true,
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
UserSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  delete user.resetToken;
  delete user.resetTokenExpiry;
  return user;
};

export default mongoose.models.User || mongoose.model('User', UserSchema);