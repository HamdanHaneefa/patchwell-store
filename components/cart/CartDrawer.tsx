'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import Script from 'next/script';
import { X, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import CartItem from './CartItem';
import CartSummary from './CartSummary';
import ShiprocketCheckoutMock from './ShiprocketCheckoutMock';



export default function CartDrawer() {
  const {
    cart,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    clearCart,
    refreshCart,
  } = useCart();
  const [isMockOpen, setIsMockOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const totalQty = cart?.totalQuantity ?? 0;
  const items = cart?.items ?? [];
  const subtotal = cart?.subtotalAmount ?? '0.00';
  const currencyCode = cart?.currencyCode ?? 'INR';

  const handleQuantityChange = async (lineId: string, currentQty: number, change: number) => {
    const newQty = currentQty + change;
    if (newQty <= 0) {
      await removeItem(lineId);
    } else {
      await updateQuantity(lineId, newQty);
    }
  };

  const handleCheckout = async (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (isCheckingOut) return;
    setIsCheckingOut(true);

    try {
      // Validate cart to ensure prices are up to date
      if (refreshCart) {
        const latestCart = await refreshCart();
        if (latestCart && latestCart.subtotalAmount !== subtotal) {
          alert('Prices have been updated. Please review your cart before checking out.');
          setIsCheckingOut(false);
          return;
        }
      }

      const res = await fetch('/api/shiprocket/access-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          subtotal,
          currency: currencyCode,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate access token');

      const token = data.token;

      if (data.is_mock) {
        // No real API keys yet — show our local checkout UI
        console.error('Shiprocket API returned is_mock: true. Error:', data.error);
        alert('Shiprocket Checkout API Error: ' + (data.error || 'Check console'));
        // setIsMockOpen(true);
      } else {
        // Real Shiprocket One-Click Checkout
        if (typeof window !== 'undefined' && (window as any).HeadlessCheckout) {
          (window as any).HeadlessCheckout.addToCart(e, token, {
            fallbackUrl: `${window.location.origin}/shop`
          });
        } else {
          // SDK not loaded yet — fall back to mock
          alert('Shiprocket SDK script not loaded yet. Make sure the script URL in layout/CartDrawer is correct.');
          // setIsMockOpen(true);
        }
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      alert('Checkout failed: ' + error.message);
      // setIsMockOpen(true);
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className={`cart-overlay${isOpen ? ' open' : ''}`} role="dialog" aria-modal="true" aria-label="Shopping Cart">
      <ShiprocketCheckoutMock
        isOpen={isMockOpen}
        onClose={() => setIsMockOpen(false)}
        subtotal={subtotal}
        currencyCode={currencyCode}
      />
      <div className="cart-overlay__backdrop" onClick={closeCart} aria-hidden="true" />
      <div className="cart-drawer">
        {/* Header */}
        <div className="cart-drawer__header">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span className="cart-drawer__title">Your Cart</span>
            <span className="cart-drawer__count">{totalQty}</span>
          </div>
          <button className="cart-drawer__close" onClick={closeCart} aria-label="Close cart">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        {items.length === 0 ? (
          <div className="cart-drawer__empty">
            <div className="cart-drawer__empty-icon">
              <ShoppingBag size={36} />
            </div>
            <h3 className="cart-drawer__empty-title">Your cart is empty</h3>
            <p className="cart-drawer__empty-desc">
              It looks like you haven&apos;t added any wellness patches to your cart yet.
            </p>
            <Link href="/shop" className="btn btn-primary" onClick={closeCart}>
              Shop Patches
            </Link>
          </div>
        ) : (
          <>
            <div className="cart-drawer__items">
              {items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onQuantityChange={handleQuantityChange}
                  onRemove={removeItem}
                />
              ))}
            </div>

            {/* Footer / Summary */}
            <div className="cart-drawer__footer">
              <CartSummary
                subtotal={subtotal}
                currencyCode={currencyCode}
                checkoutUrl={cart?.checkoutUrl}
                onCheckout={handleCheckout}
                isCheckingOut={isCheckingOut}
              />
              <p style={{ fontSize: '0.72rem', textAlign: 'center', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                🔒 Secured by Shiprocket One-Click Checkout
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
