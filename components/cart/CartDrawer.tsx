'use client';

import { useCart } from '@/context/CartContext';
import { X, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import CartItem from './CartItem';
import CartSummary from './CartSummary';

export default function CartDrawer() {
  const {
    cart,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
  } = useCart();

  const totalQty = cart?.totalQuantity ?? 0;
  const items = cart?.items ?? [];
  const subtotal = cart?.subtotalAmount ?? '0.00';
  const currencyCode = cart?.currencyCode ?? 'USD';

  const handleQuantityChange = async (lineId: string, currentQty: number, change: number) => {
    const newQty = currentQty + change;
    if (newQty <= 0) {
      await removeItem(lineId);
    } else {
      await updateQuantity(lineId, newQty);
    }
  };

  const handleCheckout = () => {
    if (cart?.checkoutUrl) {
      window.location.href = cart.checkoutUrl;
    }
  };

  return (
    <div className={`cart-overlay${isOpen ? ' open' : ''}`} role="dialog" aria-modal="true" aria-label="Shopping Cart">
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
              />
              <p style={{ fontSize: '0.72rem', textAlign: 'center', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                Redirecting to secure Shopify Checkout to complete payment.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
