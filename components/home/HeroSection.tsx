'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Star, Sparkles, Activity } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="hero">
      {/* Dynamic Animated Background Orbs */}
      <div className="hero__bg-orb hero__bg-orb--1" />
      <div className="hero__bg-orb hero__bg-orb--2" />
      <div className="hero__bg-orb hero__bg-orb--3" />

      <div className="container">
        <div className="hero__inner">
          {/* Left Content Column */}
          <div className="hero__content">
            <div className="hero__badge">
              <Sparkles size={12} style={{ marginRight: 4 }} />
              Next-Gen Transdermal Wellness
            </div>

            <h1 className="hero__title">
              Wellness that <span>sticks</span>. Simple, clean, & effective.
            </h1>

            <p className="hero__subtitle">
              Experience the power of 100% natural, drug-free wellness patches. Directly absorbed through the skin for continuous, sustained relief. Sleep better, focus sharper, and feel energized.
            </p>

            <div className="hero__actions">
              <Link href="/shop" className="btn btn-primary btn-lg">
                Shop Patches
                <ArrowRight size={18} />
              </Link>
              <Link href="/about" className="btn btn-secondary btn-lg">
                How It Works
              </Link>
            </div>

            {/* Trust Stats */}
            <div className="hero__stats">
              <div className="hero__stat">
                <div className="hero__stat-number">100k+</div>
                <div className="hero__stat-label">Happy Customers</div>
              </div>
              <div className="hero__stat">
                <div className="hero__stat-number">98%</div>
                <div className="hero__stat-label">Satisfaction Rate</div>
              </div>
              <div className="hero__stat">
                <div className="hero__stat-number">100%</div>
                <div className="hero__stat-label">Drug-Free & Vegan</div>
              </div>
            </div>
          </div>

          {/* Right Image/Graphic Column */}
          <div className="hero__image">
            <div className="hero__image-wrapper">
              <Image
                src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&auto=format&fit=crop"
                alt="Mindfulness and natural wellness patches"
                width={520}
                height={520}
                className="hero__image-main"
                priority
              />

              {/* Floating micro-animation bubbles */}
              <div className="hero__image-bubble hero__image-bubble--1">
                <div className="hero__bubble-icon">
                  <Star size={16} fill="var(--color-accent)" style={{ color: 'var(--color-accent)' }} />
                </div>
                <div className="hero__bubble-text">
                  <strong>4.9/5 Rating</strong>
                  <span>Over 5,000+ Reviews</span>
                </div>
              </div>

              <div className="hero__image-bubble hero__image-bubble--2">
                <div className="hero__bubble-icon">
                  <Activity size={16} style={{ color: 'var(--color-accent)' }} />
                </div>
                <div className="hero__bubble-text">
                  <strong>Continuous Release</strong>
                  <span>Sustained 8-12 hours</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
