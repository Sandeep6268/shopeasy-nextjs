// types/index.ts
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  comparePrice?: number;
  images: string[];
  category: string;
  tags: string[];
  inventory: number;
  rating?: number;
  reviewCount?: number;
  featured?: boolean;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}