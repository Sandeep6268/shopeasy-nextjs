// components/products/AddToCart.tsx
'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { Product } from '@/types';
import toast from 'react-hot-toast';

interface AddToCartProps {
  product: Product;
}

export default function AddToCart({ product }: AddToCartProps) {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const [addingToCart, setAddingToCart] = useState(false);

  const handleAddToCart = async () => {
    if ((product.inventory || 0) === 0) {
      toast.error('Product is out of stock');
      return;
    }

    if (quantity > (product.inventory || 0)) {
      toast.error(`Only ${product.inventory} units available`);
      return;
    }

    setAddingToCart(true);
    try {
      // Add the product multiple times based on quantity
      for (let i = 0; i < quantity; i++) {
        await addItem(product);
      }
      toast.success(`${quantity} ${product.name} added to cart!`);
      setQuantity(1); // Reset quantity after adding
    } catch (error) {
      toast.error('Failed to add product to cart');
      console.error('Add to cart error:', error);
    } finally {
      setAddingToCart(false);
    }
  };

  const maxQuantity = Math.min(product.inventory || 0, 10);

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <label htmlFor="quantity" className="text-sm font-medium text-gray-900">
          Quantity:
        </label>
        <select
          id="quantity"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          disabled={maxQuantity === 0}
        >
          {Array.from({ length: maxQuantity }, (_, i) => i + 1).map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleAddToCart}
        disabled={addingToCart || (product.inventory || 0) === 0}
        className={`w-full py-3 px-6 rounded-lg font-semibold text-lg transition-colors ${
          (product.inventory || 0) === 0
            ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
            : addingToCart
            ? 'bg-blue-400 text-white cursor-wait'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        {addingToCart ? 'Adding to Cart...' : 
         (product.inventory || 0) === 0 ? 'Out of Stock' : 'Add to Cart'}
      </button>
    </div>
  );
}