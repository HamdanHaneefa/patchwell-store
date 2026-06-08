import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: 'var(--space-4xl) var(--space-xl)', background: 'var(--color-bg)', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-dark)', marginBottom: 'var(--space-md)' }}>
        Page Not Found
      </h2>
      <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem', maxWidth: '480px', margin: '0 auto var(--space-xl)', lineHeight: 1.6 }}>
        Oops! The page you are looking for doesn't exist or has been moved.
      </p>
      <Link href="/" className="btn btn-primary">
        Return Home
      </Link>
    </div>
  );
}
