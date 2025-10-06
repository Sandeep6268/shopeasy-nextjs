// types/product.ts
export interface IProduct {
  _id?: string;
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
  featured: boolean;
  status: 'active' | 'inactive' | 'draft';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateProductInput {
  name: string;
  description: string;
  price: number;
  comparePrice?: number;
  images: string[];
  category: string;
  tags: string[];
  inventory: number;
  featured?: boolean;
}

export interface UpdateProductInput {
  name?: string;
  description?: string;
  price?: number;
  comparePrice?: number;
  images?: string[];
  category?: string;
  tags?: string[];
  inventory?: number;
  featured?: boolean;
  status?: 'active' | 'inactive' | 'draft';
}