'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import {
  createCart,
  getCart,
  addToCart as shopifyAddToCart,
  updateCartLine as shopifyUpdateCartLine,
  removeFromCart as shopifyRemoveFromCart,
} from '@/lib/shopify';
import { Cart } from '@/lib/shopify/types';

const CART_ID_KEY = 'patchwell_cart_id';

interface CartContextValue {
  cart: Cart | null;
  isLoading: boolean;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (variantId: string, quantity?: number) => Promise<void>;
  updateQuantity: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Load existing cart on mount
  useEffect(() => {
    const savedCartId = localStorage.getItem(CART_ID_KEY);
    if (savedCartId) {
      getCart(savedCartId)
        .then((fetchedCart) => {
          if (fetchedCart) {
            setCart(fetchedCart);
          } else {
            // Cart expired, clear it
            localStorage.removeItem(CART_ID_KEY);
          }
        })
        .catch(() => localStorage.removeItem(CART_ID_KEY));
    }
  }, []);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const addToCart = useCallback(
    async (variantId: string, quantity = 1) => {
      setIsLoading(true);
      try {
        let updatedCart: Cart | null;
        const lines = [{ merchandiseId: variantId, quantity }];

        if (cart?.id) {
          updatedCart = await shopifyAddToCart(cart.id, lines);
        } else {
          updatedCart = await createCart(lines);
          if (updatedCart?.id) {
            localStorage.setItem(CART_ID_KEY, updatedCart.id);
          }
        }

        if (updatedCart) {
          setCart(updatedCart);
          setIsOpen(true);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [cart]
  );

  const updateQuantity = useCallback(
    async (lineId: string, quantity: number) => {
      if (!cart?.id) return;
      setIsLoading(true);
      try {
        const updatedCart = await shopifyUpdateCartLine(cart.id, lineId, quantity);
        if (updatedCart) setCart(updatedCart);
      } finally {
        setIsLoading(false);
      }
    },
    [cart]
  );

  const removeItem = useCallback(
    async (lineId: string) => {
      if (!cart?.id) return;
      setIsLoading(true);
      try {
        const updatedCart = await shopifyRemoveFromCart(cart.id, [lineId]);
        if (updatedCart) setCart(updatedCart);
      } finally {
        setIsLoading(false);
      }
    },
    [cart]
  );

  const clearCart = useCallback(() => {
    setCart(null);
    localStorage.removeItem(CART_ID_KEY);
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        isOpen,
        openCart,
        closeCart,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
