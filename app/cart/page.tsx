'use client';

import React from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import CartItem from '@/components/cart/CartItem';
import CartSummary from '@/components/cart/CartSummary';

export default function CartPage() {
  const { cart, updateQuantity, removeItem, clearCart, refreshCart } = useCart();

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
    <div style={{ padding: 'var(--space-3xl) 0 var(--space-4xl)' }}>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <div className="container">
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.25rem', fontWeight: 800, color: 'var(--color-dark)', marginBottom: 'var(--space-2xl)' }}>
          Shopping Cart
        </h1>

        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-4xl) var(--space-xl)', background: 'var(--color-white)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ margin: '0 auto var(--space-lg)', width: 80, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: 'var(--color-accent-pale)', color: 'var(--color-accent)' }}>
              <ShoppingBag size={36} />
            </div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-dark)', marginBottom: 'var(--space-sm)' }}>
              Your cart is empty
            </h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', marginBottom: 'var(--space-xl)', maxWidth: 400, margin: '0 auto var(--space-xl)' }}>
              Browse our catalog of natural transdermal patches to sleep better, focus sharper, and feel energized.
            </p>
            <Link href="/shop" className="btn btn-primary btn-lg">
              Shop Patches
              <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 'var(--space-2xl)', alignItems: 'start' }} className="shop-page__layout">
            {/* Left Column: Cart Items List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              {items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onQuantityChange={handleQuantityChange}
                  onRemove={removeItem}
                />
              ))}
            </div>

            {/* Right Column: Order Summary */}
            <div
              style={{
                background: 'var(--color-white)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-xl)',
                position: 'sticky',
                top: 'calc(var(--header-height) + var(--space-xl))',
              }}
            >
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-dark)', marginBottom: 'var(--space-lg)', paddingBottom: 'var(--space-sm)', borderBottom: '1px solid var(--color-border)' }}>
                Order Summary
              </h2>

              <CartSummary
                subtotal={subtotal}
                currencyCode={currencyCode}
                checkoutUrl={cart?.checkoutUrl}
                onCheckout={handleCheckout}
              />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: 'var(--space-lg)', fontSize: '0.75rem', color: 'var(--color-text-muted)', textAlign: 'center' }}>
                <p>Tax and shipping fees will be computed on the checkout page.</p>
                <Link href="/shop" style={{ textDecoration: 'underline', color: 'var(--color-accent)', fontWeight: 600 }}>
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
