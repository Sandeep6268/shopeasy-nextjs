'use client';

import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { Product, CartItem, Cart } from '@/types';
import { useAuth } from './AuthContext';

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Product }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartState }
  | { type: 'SET_LOADING'; payload: boolean };

interface CartContextType {
  cart: CartState;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  let newState: CartState;

  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.product.id === action.payload.id);
      
      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.product.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        
        newState = calculateCartTotals(updatedItems);
      } else {
        const newItems = [...state.items, { product: action.payload, quantity: 1 }];
        newState = calculateCartTotals(newItems);
      }
      break;
    }
    
    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.product.id !== action.payload);
      newState = calculateCartTotals(newItems);
      break;
    }
    
    case 'UPDATE_QUANTITY': {
      const newItems = state.items.map(item =>
        item.product.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      ).filter(item => item.quantity > 0);
      
      newState = calculateCartTotals(newItems);
      break;
    }
    
    case 'CLEAR_CART':
      newState = { items: [], total: 0, itemCount: 0 };
      break;
    
    case 'LOAD_CART':
      newState = action.payload;
      break;
    
    default:
      return state;
  }

  return newState;
};

const calculateCartTotals = (items: CartItem[]): CartState => {
  const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  
  return { items, total, itemCount };
};

const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0,
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, dispatch] = useReducer(cartReducer, initialState);
  const [isLoading, setIsLoading] = React.useState(true);
  const { user } = useAuth();

  // Load cart when user changes
  useEffect(() => {
    if (user) {
      loadCart();
    } else {
      // If no user, clear cart
      dispatch({ type: 'LOAD_CART', payload: initialState });
      setIsLoading(false);
    }
  }, [user]);

  const loadCart = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const response = await fetch('/api/cart');
      
      if (response.ok) {
        const data = await response.json();
        dispatch({ type: 'LOAD_CART', payload: data.cart });
      } else {
        console.error('Failed to load cart');
      }
    } catch (error) {
      console.error('Failed to load cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveCart = async (cartData: CartState) => {
    if (!user) return;

    try {
      await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cart: cartData }),
      });
    } catch (error) {
      console.error('Failed to save cart:', error);
    }
  };

  const addItem = async (product: Product) => {
  // Transform product to match cart structure
      const cartProduct = {
        id: product.id,
        name: product.name,
        price: product.price,
        images: product.images || [], // Use images array
        inStock: (product.inventory || 0) > 0,
        inventory: product.inventory || 0,
        category: product.category,
      };

      dispatch({ type: 'ADD_ITEM', payload: cartProduct });
    };

  const removeItem = async (productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: productId });
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } });
  };

  const clearCart = async () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  // Save cart to backend whenever it changes (for authenticated users)
  useEffect(() => {
    if (user && cart !== initialState) {
      saveCart(cart);
    }
  }, [cart, user]);

  return (
    <CartContext.Provider value={{ 
      cart, 
      addItem, 
      removeItem, 
      updateQuantity, 
      clearCart,
      isLoading 
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}