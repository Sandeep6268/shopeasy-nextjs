// models/Order.ts
import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IOrderItem {
  product: {
    id: string;
    name: string;
    price: number;
    images: string[];
    inventory: number;
    category: string;
  };
  quantity: number;
  price: number;
}

export interface IShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  orderNumber: string;
  items: IOrderItem[];
  shippingInfo: IShippingInfo;
  total: number;
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  orderNumber: {
    type: String,
    required: true,
    unique: true,
  },
  items: [{
    product: {
      id: String,
      name: String,
      price: Number,
      images: [String],
      inventory: Number,
      category: String,
    },
    quantity: Number,
    price: Number,
  }],
  shippingInfo: {
    firstName: String,
    lastName: String,
    email: String,
    address: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
  },
  total: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['processing', 'shipped', 'delivered', 'cancelled'],
    default: 'processing',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

OrderSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Order: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
export default Order;