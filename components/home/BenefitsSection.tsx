'use client';

import Image from 'next/image';
import { Clock, Leaf, EyeOff, ShieldCheck } from 'lucide-react';

const benefits = [
  {
    icon: <ShieldCheck size={22} />,
    title: 'Superior Absorption',
    desc: 'By bypassing the digestive tract, active vitamins and botanical extracts enter your system directly, maximizing efficacy.',
  },
  {
    icon: <Clock size={22} />,
    title: '12-Hour Steady Release',
    desc: 'Unlike pills that cause sudden spikes and crashes, our patches deliver a controlled dose for sustained wellness all day or night.',
  },
  {
    icon: <Leaf size={22} />,
    title: 'Clean & Pure Formulation',
    desc: 'No fillers, no artificial dyes, no binders, and no sugar. Only high-purity organic active ingredients.',
  },
  {
    icon: <EyeOff size={22} />,
    title: 'Discreet & Easy to Use',
    desc: 'Extremely thin and water-resistant. Apply it once, hide it under clothing, and let it work its magic.',
  },
];

export default function BenefitsSection() {
  return (
    <section className="benefits">
      <div className="container">
        <div className="benefits__inner">
          {/* Left: Beautiful Image Column */}
          <div className="benefits__image">
            <Image
              src="https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop"
              alt="Healthy lifestyle and organic wellness ingredients"
              width={600}
              height={750}
              style={{ objectFit: 'cover' }}
            />
            <div className="benefits__image-overlay" />
          </div>

          {/* Right: Benefits Checklist */}
          <div className="benefits__content">
            <div className="section-header" style={{ textAlign: 'left', marginBottom: 'var(--space-xl)' }}>
              <span className="section-header__tag">Why Transdermal?</span>
              <h2 style={{ textAlign: 'left' }}>Better Than Pills</h2>
              <p style={{ margin: '0', textAlign: 'left' }}>
                Your body only absorbs about 10-20% of oral vitamins. Patchwell patches deliver active ingredients directly into your body.
              </p>
            </div>

            <div className="benefits__list">
              {benefits.map((benefit, idx) => (
                <div key={idx} className="benefit-item">
                  <div className="benefit-item__icon" aria-hidden="true">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="benefit-item__title">{benefit.title}</h3>
                    <p className="benefit-item__desc">{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
