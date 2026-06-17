import React from 'react';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function SuccessPage() {
  return (
    <div style={{ padding: 'var(--space-4xl) 0', textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div className="container" style={{ maxWidth: '600px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-xl)' }}>
          <CheckCircle size={80} color="var(--color-success)" />
        </div>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-dark)', marginBottom: 'var(--space-md)' }}>
          Payment Successful!
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem', marginBottom: 'var(--space-2xl)' }}>
          Thank you for your order. We are processing your request and will send an email confirmation shortly.
        </p>
        <Link href="/shop" className="btn btn-primary btn-lg">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
