import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Patchwell',
  description: 'Understand how Patchwell collects, protects, and handles your personal information when using our services.',
};

export default function PrivacyPolicyPage() {
  return (
    <div style={{ padding: 'var(--space-4xl) 0', background: 'var(--color-bg-light)' }}>
      <div className="container" style={{ maxWidth: '800px', background: 'var(--color-white)', padding: 'var(--space-2xl) var(--space-3xl)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-dark)', marginBottom: 'var(--space-lg)', borderBottom: '2px solid var(--color-accent-pale)', paddingBottom: 'var(--space-sm)' }}>
          Privacy Policy
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: 'var(--space-xl)' }}>
          Last Updated: June 17, 2026
        </p>

        <section style={{ marginBottom: 'var(--space-xl)' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-dark)', marginBottom: 'var(--space-sm)' }}>
            1. Information We Collect
          </h2>
          <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.75, marginBottom: 'var(--space-md)' }}>
            At Patchwell, we collect personal information to provide you with the best shopping experience. This includes:
          </p>
          <ul style={{ color: 'var(--color-text-muted)', lineHeight: 1.75, paddingLeft: 'var(--space-lg)', marginBottom: 'var(--space-md)' }}>
            <li><strong>Personal details:</strong> Name, shipping address, billing address, phone number, and email address.</li>
            <li><strong>Payment details:</strong> Payment token and transaction metadata. We do not store full credit card numbers or sensitive payment credentials on our servers.</li>
            <li><strong>Technical details:</strong> IP address, browser type, device information, and usage statistics gathered via cookies and tracking pixels.</li>
          </ul>
        </section>

        <section style={{ marginBottom: 'var(--space-xl)' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-dark)', marginBottom: 'var(--space-sm)' }}>
            2. How We Use Your Information
          </h2>
          <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.75, marginBottom: 'var(--space-md)' }}>
            We use the information we collect to operate, maintain, and improve our services:
          </p>
          <ul style={{ color: 'var(--color-text-muted)', lineHeight: 1.75, paddingLeft: 'var(--space-lg)', marginBottom: 'var(--space-md)' }}>
            <li>Processing and fulfilling your orders, including sending shipping updates and delivery confirmations.</li>
            <li>Communicating with you regarding customer service requests, product announcements, and promotional offers (which you can opt out of at any time).</li>
            <li>Analyzing website traffic and usage patterns to optimize user interface performance.</li>
            <li>Preventing fraud, unauthorized transactions, and legal violations.</li>
          </ul>
        </section>

        <section style={{ marginBottom: 'var(--space-xl)' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-dark)', marginBottom: 'var(--space-sm)' }}>
            3. Sharing of Information
          </h2>
          <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.75, marginBottom: 'var(--space-md)' }}>
            We only share your information with trusted third parties to facilitate transactions and store operations:
          </p>
          <ul style={{ color: 'var(--color-text-muted)', lineHeight: 1.75, paddingLeft: 'var(--space-lg)', marginBottom: 'var(--space-md)' }}>
            <li><strong>Logistics and Fulfillment:</strong> Shiprocket for address validation, checkout operations, shipping rates, and delivery logistics.</li>
            <li><strong>Payment Processors:</strong> Gateways connected through our secure checkouts for authorizing transactions.</li>
            <li><strong>Service Providers:</strong> E-commerce CMS platforms, email delivery platforms, and hosting services.</li>
          </ul>
        </section>

        <section style={{ marginBottom: 'var(--space-xl)' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-dark)', marginBottom: 'var(--space-sm)' }}>
            4. Cookies and Tracking Technologies
          </h2>
          <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.75, marginBottom: 'var(--space-md)' }}>
            We use cookies, web beacons, and pixels to personalize your shopping experience, remember items in your shopping cart, and track browsing patterns. You can manage or disable cookies in your web browser settings, although some elements of the site (like the shopping cart) may not work correctly as a result.
          </p>
        </section>

        <section style={{ marginBottom: 'var(--space-xl)' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-dark)', marginBottom: 'var(--space-sm)' }}>
            5. Security
          </h2>
          <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.75, marginBottom: 'var(--space-md)' }}>
            We use secure socket layer (SSL) encryption to transfer sensitive personal details. While we use industry-standard precautions, no system is entirely secure. We encourage you to protect your accounts and passwords diligently.
          </p>
        </section>

        <section style={{ marginBottom: 'var(--space-xl)' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-dark)', marginBottom: 'var(--space-sm)' }}>
            6. Contact Us
          </h2>
          <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.75 }}>
            If you have questions about this Privacy Policy or our practices, please reach out to us at <a href="mailto:support@patchwell.in" style={{ color: 'var(--color-accent)', textDecoration: 'underline' }}>support@patchwell.in</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
