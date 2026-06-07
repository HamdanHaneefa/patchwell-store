'use client';

import { ShieldCheck, Leaf, Truck, RotateCcw } from 'lucide-react';

const badges = [
  {
    icon: <Leaf size={24} />,
    title: '100% Natural',
    desc: 'Pure herbal active ingredients.',
  },
  {
    icon: <ShieldCheck size={24} />,
    title: 'Clinically Tested',
    desc: 'Safe & dermatologically approved.',
  },
  {
    icon: <Truck size={24} />,
    title: 'Free Shipping',
    desc: 'On all orders over $50.',
  },
  {
    icon: <RotateCcw size={24} />,
    title: '30-Day Guarantee',
    desc: 'Love them, or your money back.',
  },
];

export default function TrustBadges() {
  return (
    <section className="trust-badges">
      <div className="container">
        <div className="trust-badges__grid">
          {badges.map((badge, idx) => (
            <div key={idx} className="trust-badge">
              <div className="trust-badge__icon" aria-hidden="true">
                {badge.icon}
              </div>
              <div>
                <h3 className="trust-badge__title">{badge.title}</h3>
                <p className="trust-badge__desc">{badge.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
