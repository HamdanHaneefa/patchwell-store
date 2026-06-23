'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, XCircle, ShoppingBag } from 'lucide-react';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams?.get('oid') || searchParams?.get('order_id') || '';
  const orderStatus = searchParams?.get('ost') || searchParams?.get('status') || '';

  const isSuccess = orderStatus.toUpperCase() === 'SUCCESS';

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem',
    }}>
      <div style={{
        maxWidth: '520px',
        width: '100%',
        textAlign: 'center',
        background: 'var(--color-surface, #fff)',
        borderRadius: '16px',
        padding: '3rem 2rem',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
      }}>
        {isSuccess ? (
          <>
            <div style={{ color: '#22c55e', marginBottom: '1rem' }}>
              <CheckCircle size={64} strokeWidth={1.5} />
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-text, #1a1a2e)' }}>
              Order Placed Successfully!
            </h1>
            <p style={{ color: 'var(--color-text-muted, #666)', marginBottom: '0.5rem', lineHeight: 1.6 }}>
              Thank you for shopping with Patchwell. Your order has been confirmed and is being processed.
            </p>
            {orderId && (
              <p style={{ 
                fontSize: '0.875rem', 
                color: 'var(--color-text-muted, #888)', 
                background: 'var(--color-bg, #f5f5f5)', 
                padding: '0.75rem 1rem', 
                borderRadius: '8px',
                marginBottom: '1.5rem',
                fontFamily: 'monospace',
              }}>
                Order ID: <strong>{orderId}</strong>
              </p>
            )}
            <p style={{ color: 'var(--color-text-muted, #666)', fontSize: '0.9rem', marginBottom: '2rem', lineHeight: 1.6 }}>
              You will receive an order confirmation email shortly with tracking details.
            </p>
          </>
        ) : (
          <>
            <div style={{ color: '#ef4444', marginBottom: '1rem' }}>
              <XCircle size={64} strokeWidth={1.5} />
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-text, #1a1a2e)' }}>
              Order Could Not Be Placed
            </h1>
            <p style={{ color: 'var(--color-text-muted, #666)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              Something went wrong during checkout. Please try again or contact our support team.
            </p>
            {orderId && (
              <p style={{ 
                fontSize: '0.875rem', 
                color: 'var(--color-text-muted, #888)', 
                background: 'var(--color-bg, #f5f5f5)', 
                padding: '0.75rem 1rem', 
                borderRadius: '8px',
                marginBottom: '2rem',
                fontFamily: 'monospace',
              }}>
                Reference: <strong>{orderId}</strong>
              </p>
            )}
          </>
        )}

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link 
            href="/shop" 
            className="btn btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <ShoppingBag size={18} />
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Loading...</p>
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}
