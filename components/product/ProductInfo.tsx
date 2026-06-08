'use client';

import { Star, Shield, Truck, RotateCcw } from 'lucide-react';
import { formatPrice } from '@/lib/shopify';

interface ProductInfoProps {
  title: string;
  vendor: string;
  description: string;
  descriptionHtml?: string;
  price: string;
  compareAtPrice: string | null;
  currencyCode: string;
  children?: React.ReactNode;
}

export default function ProductInfo({
  title,
  vendor,
  description,
  descriptionHtml,
  price,
  compareAtPrice,
  currencyCode,
  children,
}: ProductInfoProps) {
  const priceNum = parseFloat(price);
  const compareAtPriceNum = compareAtPrice ? parseFloat(compareAtPrice) : 0;
  const isOnSale = compareAtPriceNum > priceNum;

  const discountPercent = isOnSale && compareAtPriceNum > 0
    ? Math.round(((compareAtPriceNum - priceNum) / compareAtPriceNum) * 100)
    : 0;

  return (
    <div className="product-detail__info">
      <div>
        <span className="product-detail__brand">{vendor}</span>
        <h1 className="product-detail__title">{title}</h1>
      </div>

      {/* Product Rating */}
      <div className="product-detail__rating">
        <div style={{ display: 'flex', gap: 2 }}>
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={16} fill="var(--color-gold)" stroke="none" />
          ))}
        </div>
        <span className="product-detail__rating-count">4.9 (428 reviews)</span>
      </div>

      {/* Pricing Section */}
      <div className="product-detail__price-row">
        <span className={`product-detail__price${isOnSale ? ' product-detail__price--sale' : ''}`}>
          {formatPrice(price, currencyCode)}
        </span>
        {isOnSale && compareAtPrice && (
          <>
            <span className="product-detail__compare-price">
              {formatPrice(compareAtPrice, currencyCode)}
            </span>
            <span className="product-detail__save">Save {discountPercent}%</span>
          </>
        )}
      </div>

      {/* Description Short */}
      <p style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)', lineHeight: 1.65 }}>
        {description ? description.replace(/\uFFFD/g, ' ').replace(/\s+/g, ' ') : ''}
      </p>

      {/* Interactive elements rendered as children (Variant Selector, Qty, Add button) */}
      {children}

      {/* Trust Checklist */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px', background: 'var(--color-bg-2)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Shield size={16} style={{ color: 'var(--color-accent)' }} />
          <span><strong>Pure Active Ingredients:</strong> Vegan, drug-free, and hypoallergenic.</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Truck size={16} style={{ color: 'var(--color-accent)' }} />
          <span><strong>Free Shipping:</strong> Automatically applied to orders over {currencyCode === 'INR' ? '₹999' : '$50'}.</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <RotateCcw size={16} style={{ color: 'var(--color-accent)' }} />
          <span><strong>Guarantee:</strong> Try risk-free with our 30-day money back policy.</span>
        </div>
      </div>

      {/* Description Html Block */}
      {descriptionHtml && (
        <div
          className="product-detail__description"
          dangerouslySetInnerHTML={{ __html: descriptionHtml.replace(/\uFFFD/g, ' ') }}
        />
      )}
    </div>
  );
}
