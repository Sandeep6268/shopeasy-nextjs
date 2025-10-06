/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['via.placeholder.com', 'res.cloudinary.com'],
    unoptimized: true, // Add this line
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  compress: false, // Important: Disable compression
  poweredByHeader: false,
}

module.exports = nextConfig