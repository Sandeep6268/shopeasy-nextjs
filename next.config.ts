// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: [
      'res.cloudinary.com',
      'localhost',
      'via.placeholder.com',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Allow all external images (be careful in production)
      },
    ],
  },
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
  },
  // For better MongoDB connection in serverless environment
  api: {
    responseLimit: '10mb',
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
}

module.exports = nextConfig