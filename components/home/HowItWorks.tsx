'use client';

import { Sparkles, Activity, CheckCircle } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: <Sparkles size={28} />,
    title: 'Peel & Apply',
    desc: 'Apply one patch daily to clean, dry skin on a relatively hairless area like your inner arm, wrist, or shoulder.',
  },
  {
    number: '02',
    icon: <Activity size={28} />,
    title: 'Steady Release',
    desc: 'The transdermal matrix slowly and continuously releases active organic ingredients over 8 to 12 hours.',
  },
  {
    number: '03',
    icon: <CheckCircle size={28} />,
    title: 'Peel & Dispose',
    desc: 'Once the day is done, simply peel the patch off. No pills, no sugary liquids, no stomach irritation.',
  },
];

export default function HowItWorks() {
  return (
    <section className="how-it-works">
      <div className="container">
        <div className="section-header">
          <span className="section-header__tag">The Method</span>
          <h2>How Patchwell Works</h2>
          <p>
            Transdermal delivery is a highly efficient way to absorb vitamins and herbs. By bypassing your digestive system, nutrients enter directly into the body.
          </p>
        </div>

        <div className="how-it-works__grid">
          {/* Connector line for desktop screens */}
          <div className="how-it-works__connector" aria-hidden="true" />

          {steps.map((step, idx) => (
            <div key={idx} className="how-it-works__step">
              <div className="how-it-works__step-number">{step.number}</div>
              <div className="how-it-works__step-icon" aria-hidden="true">
                {step.icon}
              </div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
