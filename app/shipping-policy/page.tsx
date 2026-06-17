import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shipping Policy | Patchwell',
  description: 'Understand Patchwell\'s shipping rates, delivery times, and tracking details.',
};

export default function ShippingPolicyPage() {
  return (
    <div style={{ padding: 'var(--space-4xl) 0', background: 'var(--color-bg-light)' }}>
      <div className="container" style={{ maxWidth: '800px', background: 'var(--color-white)', padding: 'var(--space-2xl) var(--space-3xl)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-dark)', marginBottom: 'var(--space-lg)', borderBottom: '2px solid var(--color-accent-pale)', paddingBottom: 'var(--space-sm)' }}>
          Shipping & Delivery Policy
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: 'var(--space-xl)' }}>
          Last Updated: June 17, 2026
        </p>

        <section style={{ marginBottom: 'var(--space-xl)' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-dark)', marginBottom: 'var(--space-sm)' }}>
            1. Shipment Processing Times
          </h2>
          <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.75, marginBottom: 'var(--space-md)' }}>
            All orders are processed and shipped within **1 to 2 business days** (excluding weekends and public holidays). 
          </p>
          <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.75 }}>
            If we experience a high volume of orders, shipments may be delayed by a few days. We will notify you via email or phone call if there is a significant delay in delivery.
          </p>
        </section>

        <section style={{ marginBottom: 'var(--space-xl)' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-dark)', marginBottom: 'var(--space-sm)' }}>
            2. Shipping Rates & Delivery Estimates
          </h2>
          <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.75, marginBottom: 'var(--space-md)' }}>
            Shipping charges for your order will be computed and displayed during the checkout process.
          </p>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 'var(--space-md)', color: 'var(--color-text-muted)' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--color-border)', textAlign: 'left', fontWeight: 'bold', color: 'var(--color-dark)' }}>
                <th style={{ padding: 'var(--space-sm) 0' }}>Shipping Method</th>
                <th style={{ padding: 'var(--space-sm) 0' }}>Estimated Delivery Time</th>
                <th style={{ padding: 'var(--space-sm) 0' }}>Shipping Cost</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: 'var(--space-sm) 0' }}>Standard Delivery</td>
                <td style={{ padding: 'var(--space-sm) 0' }}>3 - 5 business days</td>
                <td style={{ padding: 'var(--space-sm) 0' }}>Free</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: 'var(--space-sm) 0' }}>Express Delivery</td>
                <td style={{ padding: 'var(--space-sm) 0' }}>1 - 2 business days</td>
                <td style={{ padding: 'var(--space-sm) 0' }}>₹45.00</td>
              </tr>
            </tbody>
          </table>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', fontStyle: 'italic' }}>
            Note: Delivery estimates are guidelines only. Real-time courier availability, weather conditions, and regional logistical issues can affect actual delivery dates.
          </p>
        </section>

        <section style={{ marginBottom: 'var(--space-xl)' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-dark)', marginBottom: 'var(--space-sm)' }}>
            3. Order Tracking & Status
          </h2>
          <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.75, marginBottom: 'var(--space-md)' }}>
            Once your order has been dispatched, you will receive a shipment confirmation email containing your tracking number(s) and courier carrier link. The tracking link will become active within 24 hours of generation.
          </p>
        </section>

        <section style={{ marginBottom: 'var(--space-xl)' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-dark)', marginBottom: 'var(--space-sm)' }}>
            4. International Shipping
          </h2>
          <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.75, marginBottom: 'var(--space-md)' }}>
            Shiprocket One-Click Checkout currently supports deliveries only within India. For international orders, please email us directly at <a href="mailto:support@patchwell.in" style={{ color: 'var(--color-accent)', textDecoration: 'underline' }}>support@patchwell.in</a> to arrange custom international delivery rates and options.
          </p>
        </section>

        <section style={{ marginBottom: 'var(--space-xl)' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-dark)', marginBottom: 'var(--space-sm)' }}>
            5. Delivery Failures & Returns to Origin (RTO)
          </h2>
          <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.75 }}>
            In the event that the courier is unable to deliver the package after three attempts due to an incorrect address or the customer being unavailable, the shipment will be marked as Return to Origin (RTO). We will contact you to correct the delivery details and re-ship the order. Additional shipping charges may apply for repeating RTO deliveries.
          </p>
        </section>
      </div>
    </div>
  );
}
