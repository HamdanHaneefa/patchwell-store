import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions | Patchwell',
  description: 'Understand the terms of service and usage conditions when shopping with Patchwell.',
};

export default function TermsAndConditionsPage() {
  return (
    <div style={{ padding: 'var(--space-4xl) 0', background: 'var(--color-bg-light)' }}>
      <div className="container" style={{ maxWidth: '800px', background: 'var(--color-white)', padding: 'var(--space-2xl) var(--space-3xl)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-dark)', marginBottom: 'var(--space-lg)', borderBottom: '2px solid var(--color-accent-pale)', paddingBottom: 'var(--space-sm)' }}>
          Terms & Conditions
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: 'var(--space-xl)' }}>
          Last Updated: June 17, 2026
        </p>

        <section style={{ marginBottom: 'var(--space-xl)' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-dark)', marginBottom: 'var(--space-sm)' }}>
            1. Acceptance of Terms
          </h2>
          <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.75, marginBottom: 'var(--space-md)' }}>
            Welcome to Patchwell. These Terms & Conditions govern your access to and use of the website patchwell.in. By purchasing our products or utilizing our services, you agree to be bound by these terms. If you do not agree to all of these terms, please do not use our website.
          </p>
        </section>

        <section style={{ marginBottom: 'var(--space-xl)' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-dark)', marginBottom: 'var(--space-sm)' }}>
            2. Product Usage Disclaimer
          </h2>
          <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.75, marginBottom: 'var(--space-md)' }}>
            Patchwell transdermal wellness patches are made with 100% natural, clean botanical extracts and vitamins. 
          </p>
          <ul style={{ color: 'var(--color-text-muted)', lineHeight: 1.75, paddingLeft: 'var(--space-lg)', marginBottom: 'var(--space-md)' }}>
            <li>Our products and the information on this website are not intended to diagnose, treat, cure, or prevent any medical condition or disease.</li>
            <li>Always consult a medical professional before beginning any new nutritional supplement, especially if you have a pre-existing medical condition, are pregnant, or are taking medication.</li>
            <li>Discontinue use immediately if skin irritation, allergic reaction, or discomfort occurs.</li>
          </ul>
        </section>

        <section style={{ marginBottom: 'var(--space-xl)' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-dark)', marginBottom: 'var(--space-sm)' }}>
            3. Account & Purchasing Security
          </h2>
          <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.75, marginBottom: 'var(--space-md)' }}>
            When you purchase items from our store, you warrant that you are at least 18 years of age and that all payment and billing information provided is accurate and complete. We reserve the right to cancel or refuse any order for any reason, including suspected fraudulent activity or pricing errors.
          </p>
        </section>

        <section style={{ marginBottom: 'var(--space-xl)' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-dark)', marginBottom: 'var(--space-sm)' }}>
            4. Intellectual Property
          </h2>
          <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.75, marginBottom: 'var(--space-md)' }}>
            All content on this website, including product names, logos, text, design layout, graphics, images, and branding assets are the exclusive intellectual property of Patchwell. Any unauthorized reproduction, reuse, or distribution is strictly prohibited.
          </p>
        </section>

        <section style={{ marginBottom: 'var(--space-xl)' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-dark)', marginBottom: 'var(--space-sm)' }}>
            5. Limitation of Liability
          </h2>
          <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.75, marginBottom: 'var(--space-md)' }}>
            In no event shall Patchwell, its directors, employees, or partners be liable for any indirect, incidental, special, or consequential damages resulting from the use of, or inability to use, our products or services.
          </p>
        </section>

        <section style={{ marginBottom: 'var(--space-xl)' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-dark)', marginBottom: 'var(--space-sm)' }}>
            6. Governing Law
          </h2>
          <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.75 }}>
            These terms shall be governed by and construed in accordance with the laws of India. Any legal action or dispute arising out of or related to these terms shall be subject to the exclusive jurisdiction of the courts located in Malappuram, Kerala, India.
          </p>
        </section>
      </div>
    </div>
  );
}
