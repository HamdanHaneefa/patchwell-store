'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useCart } from '@/context/CartContext';
import { X, ShoppingBag, AlertTriangle, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import CartItem from './CartItem';
import CartSummary from './CartSummary';
import ShiprocketCheckoutMock from './ShiprocketCheckoutMock';

type CheckoutNotification = {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  detail?: string;
} | null;

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
  const [notification, setNotification] = useState<CheckoutNotification>(null);
  const checkoutInitiatedRef = useRef(false);
  const notificationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const totalQty = cart?.totalQuantity ?? 0;
  const items = cart?.items ?? [];
  const subtotal = cart?.subtotalAmount ?? '0.00';
  const currencyCode = cart?.currencyCode ?? 'INR';

  // Auto-dismiss notifications after 8 seconds
  const showNotification = useCallback((notif: CheckoutNotification) => {
    if (notificationTimeoutRef.current) {
      clearTimeout(notificationTimeoutRef.current);
    }
    setNotification(notif);
    if (notif) {
      notificationTimeoutRef.current = setTimeout(() => {
        setNotification(null);
      }, 8000);
    }
  }, []);

  const dismissNotification = useCallback(() => {
    if (notificationTimeoutRef.current) {
      clearTimeout(notificationTimeoutRef.current);
    }
    setNotification(null);
  }, []);

  // Listen for postMessage events from Shiprocket checkout iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Only process relevant messages (from Shiprocket checkout domain)
      if (typeof event.data !== 'object' || !event.data) return;

      const { type, status, order_id, message } = event.data;

      // Shiprocket may send different event structures
      if (type === 'checkout_success' || status === 'SUCCESS' || type === 'order_placed') {
        checkoutInitiatedRef.current = false;
        showNotification({
          type: 'success',
          message: 'Order placed successfully! 🎉',
          detail: order_id ? `Order ID: ${order_id}` : undefined,
        });
        // Optionally clear the cart after successful order
        if (clearCart) clearCart();
      } else if (type === 'checkout_failed' || status === 'FAILED' || type === 'payment_failed') {
        checkoutInitiatedRef.current = false;
        setIsCheckingOut(false);
        showNotification({
          type: 'error',
          message: 'Payment could not be completed',
          detail: message || 'Please try again or use a different payment method.',
        });
      } else if (type === 'checkout_closed' || type === 'popup_closed' || type === 'close') {
        if (checkoutInitiatedRef.current) {
          checkoutInitiatedRef.current = false;
          setIsCheckingOut(false);
          showNotification({
            type: 'warning',
            message: 'Checkout was closed',
            detail: 'Your cart items are safe. Tap "Secure Checkout" whenever you\'re ready to complete your purchase.',
          });
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [showNotification, clearCart]);

  // Detect when Shiprocket iframe/popup is removed from DOM (popup closed)
  useEffect(() => {
    if (!checkoutInitiatedRef.current) return;

    const observer = new MutationObserver(() => {
      // Look for Shiprocket checkout iframe
      const srIframe = document.querySelector('iframe[src*="shiprocket"], iframe[src*="fastrr"], #fastrr-checkout-iframe');
      if (!srIframe && checkoutInitiatedRef.current) {
        // Iframe was removed — popup was closed
        checkoutInitiatedRef.current = false;
        setIsCheckingOut(false);
        showNotification({
          type: 'warning',
          message: 'Checkout was closed',
          detail: 'Your cart items are saved. You can check out whenever you\'re ready.',
        });
      }
    });

    // Small delay to let the iframe appear first
    const timeout = setTimeout(() => {
      observer.observe(document.body, { childList: true, subtree: true });
    }, 2000);

    return () => {
      clearTimeout(timeout);
      observer.disconnect();
    };
  }, [isCheckingOut, showNotification]);

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
    dismissNotification();

    try {
      // Validate cart to ensure prices are up to date
      if (refreshCart) {
        const latestCart = await refreshCart();
        if (latestCart && latestCart.subtotalAmount !== subtotal) {
          showNotification({
            type: 'warning',
            message: 'Prices have been updated',
            detail: 'Please review your cart before checking out.',
          });
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
        // No real API keys yet — show error notification
        console.error('Shiprocket API returned is_mock: true. Error:', data.error);
        showNotification({
          type: 'error',
          message: 'Checkout service unavailable',
          detail: data.error || 'Please try again later or contact support.',
        });
      } else {
        // Real Shiprocket One-Click Checkout
        if (typeof window !== 'undefined' && (window as any).HeadlessCheckout) {
          checkoutInitiatedRef.current = true;
          (window as any).HeadlessCheckout.addToCart(e, token, {
            fallbackUrl: `${window.location.origin}/shop`
          });
        } else {
          // SDK not loaded yet
          showNotification({
            type: 'error',
            message: 'Checkout is loading',
            detail: 'The checkout service is still loading. Please wait a moment and try again.',
          });
        }
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      showNotification({
        type: 'error',
        message: 'Checkout failed',
        detail: error.message || 'An unexpected error occurred. Please try again.',
      });
    } finally {
      // Only reset if we didn't start the checkout popup
      if (!checkoutInitiatedRef.current) {
        setIsCheckingOut(false);
      }
    }
  };

  const notificationStyles: Record<string, { bg: string; border: string; icon: string; color: string }> = {
    success: { bg: 'rgba(34, 197, 94, 0.08)', border: '#22c55e', icon: '#22c55e', color: '#15803d' },
    error: { bg: 'rgba(239, 68, 68, 0.08)', border: '#ef4444', icon: '#ef4444', color: '#b91c1c' },
    warning: { bg: 'rgba(245, 158, 11, 0.08)', border: '#f59e0b', icon: '#f59e0b', color: '#92400e' },
    info: { bg: 'rgba(59, 130, 246, 0.08)', border: '#3b82f6', icon: '#3b82f6', color: '#1d4ed8' },
  };

  const NotificationIcon = notification?.type === 'success' ? CheckCircle
    : notification?.type === 'error' ? XCircle
    : AlertTriangle;

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

        {/* Checkout Status Notification */}
        {notification && (
          <div
            className="cart-notification"
            style={{
              padding: '12px 16px',
              margin: '0 16px 8px',
              borderRadius: '10px',
              background: notificationStyles[notification.type].bg,
              borderLeft: `3px solid ${notificationStyles[notification.type].border}`,
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              animation: 'slideDown 0.3s ease-out',
              position: 'relative',
            }}
            role="alert"
          >
            <NotificationIcon
              size={18}
              style={{ color: notificationStyles[notification.type].icon, flexShrink: 0, marginTop: '1px' }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                fontWeight: 600,
                fontSize: '0.85rem',
                color: notificationStyles[notification.type].color,
                margin: 0,
                lineHeight: 1.3,
              }}>
                {notification.message}
              </p>
              {notification.detail && (
                <p style={{
                  fontSize: '0.78rem',
                  color: 'var(--color-text-muted)',
                  margin: '3px 0 0',
                  lineHeight: 1.4,
                }}>
                  {notification.detail}
                </p>
              )}
              {(notification.type === 'error' || notification.type === 'warning') && (
                <button
                  onClick={(e) => {
                    dismissNotification();
                    handleCheckout(e);
                  }}
                  style={{
                    marginTop: '8px',
                    padding: '5px 14px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    borderRadius: '6px',
                    border: `1px solid ${notificationStyles[notification.type].border}`,
                    background: 'transparent',
                    color: notificationStyles[notification.type].color,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = notificationStyles[notification.type].bg)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <RefreshCw size={13} />
                  Try Again
                </button>
              )}
            </div>
            <button
              onClick={dismissNotification}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '2px',
                color: 'var(--color-text-muted)',
                flexShrink: 0,
              }}
              aria-label="Dismiss notification"
            >
              <X size={14} />
            </button>
          </div>
        )}

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

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
