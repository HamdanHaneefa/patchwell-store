'use client';

import { Lock } from 'lucide-react';
import { formatPrice } from '@/lib/shopify';

interface CartSummaryProps {
  subtotal: string;
  currencyCode: string;
  checkoutUrl?: string;
  onCheckout?: () => void;
}

export default function CartSummary({
  subtotal,
  currencyCode,
  checkoutUrl,
  onCheckout,
}: CartSummaryProps) {
  const subtotalVal = parseFloat(subtotal);
  const shippingVal = subtotalVal >= 50 ? 0 : 5;
  const totalVal = (subtotalVal + shippingVal).toFixed(2);

  const handleCheckoutClick = () => {
    if (onCheckout) {
      onCheckout();
    } else if (checkoutUrl) {
      window.location.href = checkoutUrl;
    }
  };

  return (
    <div className="cart-drawer__footer" style={{ padding: 0, borderTop: 'none', background: 'transparent' }}>
      <div className="cart-drawer__totals">
        <div className="cart-drawer__total-row">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal, currencyCode)}</span>
        </div>
        <div className="cart-drawer__total-row">
          <span>Shipping</span>
          <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>
            {subtotalVal >= 50 ? 'FREE' : '$5.00'}
          </span>
        </div>
        <div className="cart-drawer__total-row cart-drawer__total-row--main">
          <span>Total</span>
          <span>{formatPrice(totalVal, currencyCode)}</span>
        </div>
      </div>

      <button
        className="cart-drawer__checkout"
        onClick={handleCheckoutClick}
        style={{ marginTop: 'var(--space-md)' }}
      >
        <Lock size={16} />
        Secure Checkout
      </button>
    </div>
  );
}
