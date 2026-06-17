'use client';

import { useCart } from '@/context/CartContext';
import Script from 'next/script';
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
    clearCart,
    refreshCart,
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

  const handleCheckout = async () => {
    try {
      // Validate cart to ensure prices are up to date
      if (refreshCart) {
        const latestCart = await refreshCart();
        if (latestCart && latestCart.subtotalAmount !== subtotal) {
          alert('Prices have been updated to reflect the latest store changes. Please review your cart before checking out.');
          return; // Stop checkout flow
        }
      }

      const subtotalVal = parseFloat(subtotal);
      const shippingVal = 0; // Free shipping for testing
      const totalVal = subtotalVal + shippingVal;

      const amountInPaise = Math.round(totalVal * 100);
      
      const res = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amountInPaise, currency: currencyCode }),
      });
      
      const orderData = await res.json();
      
      if (!res.ok) throw new Error(orderData.error || 'Failed to create order');

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Patchwell",
        description: "Purchase",
        order_id: orderData.order_id,
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            const verifyData = await verifyRes.json();
            if (verifyRes.ok) {
              clearCart();
              closeCart();
              window.location.href = '/success';
            } else {
              alert('Payment verification failed: ' + verifyData.error);
            }
          } catch (err: any) {
            alert('Verification error: ' + err.message);
          }
        },
        theme: { color: "#3399cc" }
      };

      const rzp1 = new (window as any).Razorpay(options);
      rzp1.on('payment.failed', function (response: any) {
          alert('Payment failed: ' + response.error.description);
      });
      rzp1.open();
    } catch (error: any) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <div className={`cart-overlay${isOpen ? ' open' : ''}`} role="dialog" aria-modal="true" aria-label="Shopping Cart">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
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
                Powered by Razorpay Secure Checkout.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
