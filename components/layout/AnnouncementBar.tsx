'use client';

import { useEffect, useRef } from 'react';

const messages = [
  '🌿 Free shipping on orders over ₹999',
  '✨ Subscribe & Save 20% on every order',
  '💚 100% Natural & Drug-Free',
  '⭐ Clinically tested ingredients',
  '🔄 60-day money-back guarantee',
];

export default function AnnouncementBar() {
  const trackRef = useRef<HTMLDivElement>(null);

  return (
    <div className="announcement-bar" role="banner" aria-label="Promotions">
      <div className="announcement-bar__track" ref={trackRef}>
        {[...messages, ...messages].map((msg, i) => (
          <span key={i} className="announcement-bar__item">
            <span>•</span>
            {msg}
          </span>
        ))}
      </div>
    </div>
  );
}
