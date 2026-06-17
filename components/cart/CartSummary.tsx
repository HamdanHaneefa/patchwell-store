'use client';

import { Lock, Loader2 } from 'lucide-react';
import { formatPrice } from '@/lib/shopify';

interface CartSummaryProps {
  subtotal: string;
  currencyCode: string;
  checkoutUrl?: string;
  onCheckout?: () => void;
  isCheckingOut?: boolean;
}

export default function CartSummary({
  subtotal,
  currencyCode,
  checkoutUrl,
  onCheckout,
  isCheckingOut = false,
}: CartSummaryProps) {
  const subtotalVal = parseFloat(subtotal);
  const shippingVal = 0; // Free shipping
  const totalVal = (subtotalVal + shippingVal).toFixed(2);

  const handleCheckoutClick = () => {
    if (isCheckingOut) return;
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
            FREE
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
        disabled={isCheckingOut}
        aria-busy={isCheckingOut}
        style={{
          marginTop: 'var(--space-md)',
          opacity: isCheckingOut ? 0.8 : 1,
          cursor: isCheckingOut ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
        }}
      >
        {isCheckingOut ? (
          <>
            <Loader2 size={16} style={{ animation: 'spin 0.8s linear infinite' }} />
            Connecting...
          </>
        ) : (
          <>
            <Lock size={16} />
            Secure Checkout
          </>
        )}
      </button>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
