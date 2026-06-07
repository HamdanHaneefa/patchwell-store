'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Search, Menu, X, ChevronRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';

const navLinks = [
  { label: 'Shop All', href: '/shop' },
  { label: 'Contact', href: '/faq#contact' },
  { label: 'About', href: '/about' },
];

export default function Header() {
  const { cart, openCart } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const totalQty = cart?.totalQuantity ?? 0;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header className={`header${scrolled ? ' scrolled' : ''}`}>
        <div className="container">
          <div className="header__inner">
            {/* Logo */}
            <Link href="/" className="header__logo" aria-label="Patchwell Home">
              <Image
                src="/images/logo.png"
                alt="Patchwell"
                width={120}
                height={36}
                priority
              />
            </Link>

            {/* Desktop Nav */}
            <nav className="header__nav" aria-label="Main navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="header__nav-link"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="header__actions">
              <button
                className="header__icon-btn"
                aria-label="Search"
                id="header-search-btn"
              >
                <Search size={20} />
              </button>

              <button
                className="header__icon-btn"
                onClick={openCart}
                aria-label={`Shopping cart with ${totalQty} items`}
                id="header-cart-btn"
              >
                <ShoppingBag size={20} />
                {totalQty > 0 && (
                  <span className="header__cart-badge" aria-hidden="true">
                    {totalQty > 99 ? '99+' : totalQty}
                  </span>
                )}
              </button>

              {/* Mobile menu toggle */}
              <button
                className="header__menu-btn"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
                id="header-menu-btn"
              >
                <Menu size={22} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <div
        className={`mobile-nav${mobileOpen ? ' open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <div
          className="mobile-nav__backdrop"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
        <div className="mobile-nav__drawer">
          <div className="mobile-nav__header">
            <Image
              src="/images/logo.png"
              alt="Patchwell"
              width={120}
              height={34}
              style={{ height: 34, width: 'auto' }}
            />
            <button
              className="header__icon-btn"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            >
              <X size={22} />
            </button>
          </div>
          <nav className="mobile-nav__links">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="mobile-nav__link"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
                <ChevronRight size={16} />
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}
