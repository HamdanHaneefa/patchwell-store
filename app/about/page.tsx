import { Metadata } from 'next';
import Image from 'next/image';
import { Microscope, Heart, Eye } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Our Story',
  description: 'Learn about Patchwell\'s mission to redefine personal wellness using natural, clean, and effective transdermal patches.',
};

export default function AboutPage() {
  return (
    <div style={{ paddingBottom: 'var(--space-4xl)' }}>
      {/* Plum Banner Hero */}
      <section className="about-hero">
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <h1>Redefining Daily Wellness</h1>
          <p>
            We believe wellness should be simple, clean, and continuous. No hard-to-swallow pills, no sugary gummies, no caffeine crashes. Just simple patches that work.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="about-mission">
        <div className="container">
          <div className="about-mission__inner">
            <div>
              <h2 style={{ fontSize: '2rem', marginBottom: 'var(--space-md)' }}>Our Mission</h2>
              <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.75, marginBottom: 'var(--space-md)' }}>
                Patchwell was founded with a simple goal: to create a highly efficient, clean delivery system for vitamins and botanical nutrients. By utilizing advanced transdermal technology, we bypass the digestive system entirely, ensuring active ingredients are absorbed directly and steadily.
              </p>
              <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.75 }}>
                We work alongside biochemists and doctors to formulate patches that target specific daily needs — from sleep support to mental focus, metabolic health, and clean energy.
              </p>
            </div>
            <div style={{ position: 'relative', borderRadius: 'var(--radius-xl)', overflow: 'hidden', height: 400, boxShadow: 'var(--shadow-md)' }}>
              <Image
                src="https://images.unsplash.com/photo-1543362906-acfc16c67564?w=600&auto=format&fit=crop"
                alt="Natural apothecary wellness setup"
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Science Section */}
      <section id="science" style={{ padding: 'var(--space-4xl) 0', background: 'var(--color-white)', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container">
          <div className="about-mission__inner" style={{ direction: 'rtl' }}>
            <div style={{ textAlign: 'left' }}>
              <h2 style={{ fontSize: '2rem', marginBottom: 'var(--space-md)' }}>The Transdermal Advantage</h2>
              <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.75, marginBottom: 'var(--space-md)' }}>
                When you swallow a pill, it passes through your stomach acids and your liver, destroying up to 80-90% of the active ingredients before they reach your bloodstream. This is known as the &ldquo;first-pass effect.&rdquo;
              </p>
              <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.75 }}>
                Patchwell transdermal patches use a slow-release matrix that delivers ingredients directly through your skin pores and into your local capillaries. This allows for a continuous, steady stream of nutrients over 8 to 12 hours.
              </p>
            </div>
            <div style={{ position: 'relative', borderRadius: 'var(--radius-xl)', overflow: 'hidden', height: 400, boxShadow: 'var(--shadow-md)' }}>
              <Image
                src="https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=600&auto=format&fit=crop"
                alt="Scientist researching organic plant extracts"
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section id="sustainability" className="about-values">
        <div className="container">
          <div className="section-header">
            <span className="section-header__tag">Core Philosophy</span>
            <h2>Our Values</h2>
            <p>We believe in creating high-quality wellness items that are kind to your body and the planet.</p>
          </div>

          <div className="about-values__grid">
            {/* Value 1 */}
            <div className="value-card">
              <div className="value-card__icon" aria-hidden="true">
                <Microscope size={28} />
              </div>
              <h3>Science-Backed</h3>
              <p>
                Every active herb, extract, and vitamin in our patches is backed by clinical studies verifying safe skin absorption and efficacy.
              </p>
            </div>

            {/* Value 2 */}
            <div className="value-card">
              <div className="value-card__icon" aria-hidden="true">
                <Eye size={28} />
              </div>
              <h3>100% Transparent</h3>
              <p>
                We list every single ingredient on our label. Our patches are free of fillers, chemical binders, sugar, synthetic dyes, and latex.
              </p>
            </div>

            {/* Value 3 */}
            <div className="value-card">
              <div className="value-card__icon" aria-hidden="true">
                <Heart size={28} />
              </div>
              <h3>Eco-Friendly</h3>
              <p>
                Our patch backing is made from plant-based, biodegradable cellulose. We print on recycled paper and ship using carbon-neutral delivery partners.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
