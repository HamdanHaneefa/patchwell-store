import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Refund Policy | Patchwell',
  description: 'Understand Patchwell\'s refund and return policies, including our 30-day money-back guarantee.',
};

export default function RefundPolicyPage() {
  return (
    <div style={{ padding: 'var(--space-4xl) 0', background: 'var(--color-bg-light)' }}>
      <div className="container" style={{ maxWidth: '800px', background: 'var(--color-white)', padding: 'var(--space-2xl) var(--space-3xl)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-dark)', marginBottom: 'var(--space-lg)', borderBottom: '2px solid var(--color-accent-pale)', paddingBottom: 'var(--space-sm)' }}>
          Refund & Return Policy
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: 'var(--space-xl)' }}>
          Last Updated: June 17, 2026
        </p>

        <section style={{ marginBottom: 'var(--space-xl)' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-dark)', marginBottom: 'var(--space-sm)' }}>
            1. 30-Day Money-Back Guarantee
          </h2>
          <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.75, marginBottom: 'var(--space-md)' }}>
            We want you to be completely satisfied with your Patchwell products. If you are not happy with your purchase, you are eligible to request a refund or exchange within **30 days** of receiving your items.
          </p>
          <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.75 }}>
            To qualify, simply email us at <a href="mailto:support@patchwell.in" style={{ color: 'var(--color-accent)', textDecoration: 'underline' }}>support@patchwell.in</a> with your order number and the reason for your request.
          </p>
        </section>

        <section style={{ marginBottom: 'var(--space-xl)' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-dark)', marginBottom: 'var(--space-sm)' }}>
            2. Return Process
          </h2>
          <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.75, marginBottom: 'var(--space-md)' }}>
            If you need to return physical items:
          </p>
          <ul style={{ color: 'var(--color-text-muted)', lineHeight: 1.75, paddingLeft: 'var(--space-lg)', marginBottom: 'var(--space-md)' }}>
            <li>Please contact us first to receive a Return Merchandise Authorization (RMA) and a prepaid return label (if applicable).</li>
            <li>Pack the unused product sheets or packages securely in their original packaging to prevent damage during transit.</li>
            <li>Affix the shipping label and drop it off at any authorized courier location.</li>
          </ul>
        </section>

        <section style={{ marginBottom: 'var(--space-xl)' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-dark)', marginBottom: 'var(--space-sm)' }}>
            3. Refunds
          </h2>
          <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.75, marginBottom: 'var(--space-md)' }}>
            Once we receive and inspect your returned shipment, we will notify you of the approval or rejection of your refund. If approved:
          </p>
          <ul style={{ color: 'var(--color-text-muted)', lineHeight: 1.75, paddingLeft: 'var(--space-lg)', marginBottom: 'var(--space-md)' }}>
            <li>A credit will be automatically applied to your original payment method (e.g., credit card, UPI account) within **5 to 7 business days**.</li>
            <li>Please note that it may take additional time for your bank or payment provider to process and post the transaction.</li>
          </ul>
        </section>

        <section style={{ marginBottom: 'var(--space-xl)' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-dark)', marginBottom: 'var(--space-sm)' }}>
            4. Damaged or Defective Items
          </h2>
          <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.75, marginBottom: 'var(--space-md)' }}>
            If your patches arrive damaged, defective, or if you receive the wrong item, please email us immediately with pictures of the damaged package. We will ship a replacement order to you free of charge or issue a full refund immediately.
          </p>
        </section>

        <section style={{ marginBottom: 'var(--space-xl)' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-dark)', marginBottom: 'var(--space-sm)' }}>
            5. Cancellation Policy
          </h2>
          <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.75 }}>
            Orders can be cancelled before they enter the shipping and fulfillment phase (typically within 1-2 hours of order placement). Once an order has been shipped and a tracking number is generated, it cannot be cancelled but can still be returned for a refund under our 30-day money-back policy.
          </p>
        </section>
      </div>
    </div>
  );
}
