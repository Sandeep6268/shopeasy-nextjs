// lib/mongodb.ts - UPDATED
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || 'ecommerce';

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongoose || {
  conn: null,
  promise: null,
};

if (!global.mongoose) {
  global.mongoose = cached;
}

async function dbConnect(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      dbName: MONGODB_DB_NAME,
      maxPoolSize: 10, // Connection pool size
    };

    //console.log('🔄 Connecting to MongoDB Atlas...');
    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongoose) => {
        //console.log('✅ MongoDB Atlas Connected successfully');
        return mongoose;
      })
      .catch((error) => {
        console.error('❌ MongoDB Atlas connection failed:', error);
        cached.promise = null;
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

export default dbConnect;