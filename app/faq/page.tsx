'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    category: 'general',
    question: 'How do Patchwell wellness patches work?',
    answer: 'Our patches work using transdermal delivery. Active botanical extracts, vitamins, and nutrients are embedded in a slow-release adhesive matrix. When applied, your body heat activates the release of these ingredients, letting them absorb directly through your skin pores into local blood vessels. This bypasses your digestive tract entirely, ensuring higher bioavailability and preventing stomach irritation.',
  },
  {
    category: 'general',
    question: 'Where is the best place to apply the patch?',
    answer: 'Apply the patch to clean, dry, and relatively hairless skin. The best areas with thin skin and good blood flow include the inner arm, wrist, back of the shoulder, upper thigh, or lower back. Avoid applying to broken skin, wounds, or areas with thick body hair.',
  },
  {
    category: 'general',
    question: 'Can I wear more than one patch at the same time?',
    answer: 'Yes, you can combine patches (e.g., wearing a Focus State patch during the work day and a Dream patch at night). However, if you are wearing multiple active formulas simultaneously, monitor how you feel and ensure they fit your lifestyle. Do not exceed two active patches at once unless directed by a health professional.',
  },
  {
    category: 'products',
    question: 'Are Patchwell patches waterproof?',
    answer: 'Our patches are water-resistant, meaning they will stay on during standard showers, workouts, and sweat. However, we do not recommend long swims or heavy soaking (hot tubs) while wearing them, as it can weaken the plant-based adhesive.',
  },
  {
    category: 'products',
    question: 'How long should I keep a patch on?',
    answer: 'For optimal delivery, leave the patch on for 8 to 12 hours. The transdermal matrix releases its ingredients steadily over this timeframe. After 12 hours, simply peel off and discard. Do not reuse a patch.',
  },
  {
    category: 'products',
    question: 'Are there any side effects?',
    answer: 'Our patches are drug-free, vegan, latex-free, and hypoallergenic, making them very safe for most skin types. Some users with sensitive skin may experience slight temporary redness from the adhesive. If you experience irritation, discontinue use. If you have pre-existing medical conditions or are pregnant, consult your doctor before using.',
  },
  {
    category: 'shipping',
    question: 'How much does shipping cost?',
    answer: 'Shipping is completely FREE for all orders over $50 within the US. For orders under $50, we charge a flat-rate shipping fee of $5.00. Expedited shipping options are available at checkout.',
  },
  {
    category: 'shipping',
    question: 'What is your return policy?',
    answer: 'We want you to love your patches! We offer a 30-day money-back guarantee. If you are not satisfied with your purchase, contact our support team within 30 days of receipt, and we will issue a full refund, no questions asked.',
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // Default open first item
  const [activeTab, setActiveTab] = useState<string>('all');

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const filteredFaqs = faqs.filter(
    (faq) => activeTab === 'all' || faq.category === activeTab
  );

  return (
    <div style={{ paddingBottom: 'var(--space-4xl)' }}>
      {/* Banner */}
      <section className="page-hero">
        <div className="container">
          <h1>Frequently Asked Questions</h1>
          <p>Have questions about transdermal patches or shipping? Find your answers below.</p>
        </div>
      </section>

      {/* Tabs */}
      <div className="container" style={{ marginTop: 'var(--space-2xl)' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 'var(--space-sm)',
            marginBottom: 'var(--space-2xl)',
            flexWrap: 'wrap',
          }}
        >
          {['all', 'general', 'products', 'shipping'].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setOpenIndex(0); // Reset accordion to first item on tab switch
              }}
              className="btn"
              style={{
                background: activeTab === tab ? 'var(--color-dark)' : 'var(--color-white)',
                color: activeTab === tab ? 'var(--color-white)' : 'var(--color-text)',
                border: '1px solid var(--color-border)',
                padding: '0.5rem 1.25rem',
                fontSize: '0.85rem',
                textTransform: 'capitalize',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="faq__list">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className={`faq-item${isOpen ? ' open' : ''}`}>
                <button
                  className="faq-item__question"
                  onClick={() => handleToggle(idx)}
                  aria-expanded={isOpen}
                >
                  {faq.question}
                  <ChevronDown className="faq-item__icon" size={18} />
                </button>
                <div className="faq-item__answer">
                  <p>{faq.answer}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
