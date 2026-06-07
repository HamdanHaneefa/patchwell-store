'use client';

import React, { useRef } from 'react';
import { ArrowLeft, ArrowRight, Star, Check } from 'lucide-react';

const testimonials = [
  {
    rating: 5,
    text: "The Dream Sleep Patch is a complete game changer! I fall asleep within 20 minutes and wake up without that heavy, sluggish, groggy feeling. Best sleep I've had in years.",
    name: 'Sarah M.',
    avatar: 'SM',
    product: 'Dream Sleep Patch',
  },
  {
    rating: 5,
    text: "I've replaced my midday energy drinks with the Energy Boost Patch. It gives me a clean, steady wave of focus all afternoon. Jitter-free and no sugar crash.",
    name: 'David T.',
    avatar: 'DT',
    product: 'Energy Boost Patch',
  },
  {
    rating: 5,
    text: "Focus State keeps me completely dialed in for my deep work sessions. I put it on in the morning and my mind stays clear and productive. Highly recommend.",
    name: 'Jessica L.',
    avatar: 'JL',
    product: 'Focus State Patch',
  },
  {
    rating: 5,
    text: "I was skeptical about transdermal patches, but the Stress Down Patch has seriously leveled out my daily anxiety. I feel much more grounded and balanced.",
    name: 'Marcus K.',
    avatar: 'MK',
    product: 'Stress Down Patch',
  },
  {
    rating: 5,
    text: "I have been using the Berberine GLP-1 patch for 3 weeks now, and my afternoon sugar cravings are completely gone. It's so easy and doesn't upset my stomach.",
    name: 'Amara N.',
    avatar: 'AN',
    product: 'Berberine Upgraded GLP-1 Patch',
  },
];

export default function ReviewsCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 360; // Approximate card width + gap
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="reviews">
      <div className="container">
        <div className="section-header">
          <span className="section-header__tag">Testimonials</span>
          <h2>Loved by Thousands</h2>
          <p>
            Read reviews from real customers who have transformed their daily wellness routines with Patchwell.
          </p>
        </div>

        {/* Scrollable Track */}
        <div className="reviews__track" ref={scrollRef}>
          {testimonials.map((t, idx) => (
            <div key={idx} className="review-card">
              <div className="review-card__stars">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} size={16} fill="var(--color-gold)" stroke="none" />
                ))}
              </div>
              <p className="review-card__text">{t.text}</p>
              <div className="review-card__author">
                <div className="review-card__avatar" aria-hidden="true">
                  {t.avatar}
                </div>
                <div>
                  <h4 className="review-card__name">{t.name}</h4>
                  <span className="review-card__product">{t.product}</span>
                </div>
                <div className="review-card__verified">
                  <Check size={10} strokeWidth={3} />
                  Verified Buyer
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Controls */}
        <div className="reviews__controls">
          <button
            className="reviews__btn"
            onClick={() => scroll('left')}
            aria-label="Scroll reviews left"
          >
            <ArrowLeft size={20} />
          </button>
          <button
            className="reviews__btn"
            onClick={() => scroll('right')}
            aria-label="Scroll reviews right"
          >
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}
