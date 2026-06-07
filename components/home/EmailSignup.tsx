'use client';

import React, { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';

export default function EmailSignup() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setEmail('');
    }
  };

  return (
    <section className="email-signup">
      {/* Background Graphic Blobs */}
      <div className="email-signup__bg-orb email-signup__bg-orb--1" />
      <div className="email-signup__bg-orb email-signup__bg-orb--2" />

      <div className="container">
        <div className="email-signup__inner">
          <span className="email-signup__tag">Stay Connected</span>
          <h2>Join the Wellness Club</h2>
          <p>
            Subscribe to receive exclusive offers, early access to new product releases, and educational tips on transdermal health. Get <strong>15% OFF</strong> your first order!
          </p>

          {submitted ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '16px', color: 'white', animation: 'popIn 0.3s ease' }}>
              <CheckCircle size={32} style={{ color: 'var(--color-accent-light)' }} />
              <strong style={{ fontSize: '1.2rem' }}>You&apos;re on the list!</strong>
              <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.75)', fontSize: '0.9rem' }}>
                Check your inbox for your 15% discount code.
              </p>
            </div>
          ) : (
            <form className="email-signup__form" onSubmit={handleSubmit}>
              <input
                type="email"
                required
                placeholder="Enter your email address"
                className="email-signup__input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Email address for newsletter"
              />
              <button type="submit" className="email-signup__btn">
                Subscribe
                <Send size={14} style={{ marginLeft: 6, display: 'inline', verticalAlign: 'middle' }} />
              </button>
            </form>
          )}

          <p className="email-signup__disclaimer">
            By signing up, you agree to our Privacy Policy. Easy opt-out at any time.
          </p>
        </div>
      </div>
    </section>
  );
}
