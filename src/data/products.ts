import { Product } from '@/types';

export const products: Product[] = [
  {
    id: '1',
    name: 'Wireless Bluetooth Headphones',
    description: 'High-quality wireless headphones with noise cancellation and premium sound quality.',
    price: 129.99,
    originalPrice: 179.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&h=500&fit=crop'
    ],
    category: 'Electronics',
    tags: ['wireless', 'bluetooth', 'audio'],
    inStock: true,
    rating: 4.5,
    reviewCount: 128,
    features: ['Noise Cancellation', '30hr Battery', 'Fast Charging']
  },
  {
    id: '2',
    name: 'Smart Fitness Watch',
    description: 'Advanced fitness tracking with heart rate monitoring and GPS.',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1544117519-31a4b719223d?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1434493652601-87e531963988?w=500&h=500&fit=crop'
    ],
    category: 'Electronics',
    tags: ['fitness', 'smartwatch', 'health'],
    inStock: true,
    rating: 4.3,
    reviewCount: 89,
    features: ['Heart Rate Monitor', 'GPS', 'Water Resistant']
  },
  {
    id: '3',
    name: 'Organic Cotton T-Shirt',
    description: 'Comfortable and sustainable organic cotton t-shirt in various colors.',
    price: 29.99,
    originalPrice: 39.99,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&h=500&fit=crop'
    ],
    category: 'Clothing',
    tags: ['organic', 'cotton', 'sustainable'],
    inStock: true,
    rating: 4.7,
    reviewCount: 256,
    features: ['100% Organic Cotton', 'Machine Washable', 'Multiple Colors']
  },
  {
    id: '4',
    name: 'Professional Camera',
    description: 'DSLR camera with 24MP sensor and 4K video recording.',
    price: 899.99,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&h=500&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=500&h=500&fit=crop'
    ],
    category: 'Electronics',
    tags: ['camera', 'photography', 'dslr'],
    inStock: false,
    rating: 4.8,
    reviewCount: 67,
    features: ['24MP Sensor', '4K Video', 'Wi-Fi Connectivity']
  },
  {
    id: '5',
    name: 'Designer Backpack',
    description: 'Stylish and functional backpack with laptop compartment.',
    price: 79.99,
    originalPrice: 99.99,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1581338834647-b0fb40704e21?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&h=500&fit=crop'
    ],
    category: 'Accessories',
    tags: ['bag', 'laptop', 'travel'],
    inStock: true,
    rating: 4.4,
    reviewCount: 142,
    features: ['Laptop Compartment', 'Water Resistant', 'Multiple Pockets']
  },
  {
    id: '6',
    name: 'Wireless Earbuds',
    description: 'True wireless earbuds with charging case and touch controls.',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1590658165737-15a047b8b5e0?w=500&h=500&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1590658165737-15a047b8b5e0?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500&h=500&fit=crop'
    ],
    category: 'Electronics',
    tags: ['wireless', 'earbuds', 'audio'],
    inStock: true,
    rating: 4.2,
    reviewCount: 203,
    features: ['True Wireless', 'Charging Case', 'Touch Controls']
  }
];