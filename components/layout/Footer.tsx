'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Twitter, Facebook, ArrowUp } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          {/* Brand Info */}
          <div className="footer__brand">
            <Link href="/" className="footer__brand-logo" aria-label="Patchwell Home">
              <Image
                src="/images/logo.png"
                alt="Patchwell Logo"
                width={130}
                height={38}
                style={{ height: 38, width: 'auto' }}
              />
            </Link>
            <p className="footer__brand-desc">
              Premium, 100% natural, drug-free transdermal wellness patches designed to help you sleep, focus, energize, and feel your best self.
            </p>
            <div className="footer__socials">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="footer__social-link"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="footer__social-link"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="footer__social-link"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
            </div>
          </div>

          {/* Shop Column */}
          <div>
            <h3 className="footer__col-title">Shop</h3>
            <div className="footer__links">
              <Link href="/shop" className="footer__link">Shop All</Link>
              <Link href="/collections/sleep" className="footer__link">Sleep Patches</Link>
              <Link href="/collections/energy" className="footer__link">Energy Patches</Link>
              <Link href="/collections/focus" className="footer__link">Focus Patches</Link>
              <Link href="/collections/calm" className="footer__link">Calm Patches</Link>
            </div>
          </div>

          {/* Information Column */}
          <div>
            <h3 className="footer__col-title">Information</h3>
            <div className="footer__links">
              <Link href="/about" className="footer__link">Our Story</Link>
              <Link href="/faq" className="footer__link">FAQs</Link>
              <Link href="/about#science" className="footer__link">The Science</Link>
              <Link href="/about#sustainability" className="footer__link">Sustainability</Link>
            </div>
          </div>

          {/* Customer Service Column */}
          <div>
            <h3 className="footer__col-title">Help</h3>
            <div className="footer__links">
              <Link href="/faq#shipping" className="footer__link">Shipping & Delivery</Link>
              <Link href="/faq#returns" className="footer__link">Returns & Refunds</Link>
              <Link href="/faq#contact" className="footer__link">Contact Us</Link>
              <Link href="/faq#account" className="footer__link">My Account</Link>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer__bottom">
          <p className="footer__copyright">
            &copy; {new Date().getFullYear()} Patchwell. All rights reserved. Designed for wellness.
          </p>

          <div className="footer__legal">
            <Link href="/privacy-policy" className="footer__legal-link">Privacy Policy</Link>
            <Link href="/terms-and-conditions" className="footer__legal-link">Terms & Conditions</Link>
            <Link href="/refund-policy" className="footer__legal-link">Refund Policy</Link>
            <Link href="/shipping-policy" className="footer__legal-link">Shipping Policy</Link>
          </div>

          <div className="footer__payment-icons">
            {/* Simple payment icons text for premium placeholder look */}
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginRight: '8px' }}>
              We accept:
            </span>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-dark)' }}>
              Visa &bull; Mastercard &bull; Amex &bull; ShopPay &bull; GPay
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
