'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Star, ShoppingCart } from 'lucide-react';
import { Product } from '@/lib/shopify/types';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/shopify';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevents navigating to the detail page when clicking quick add
    if (product.variants.length > 0) {
      await addToCart(product.variants[0].id, 1);
    }
  };

  // Determine badge type if applicable
  const renderBadge = () => {
    if (product.isOnSale) {
      return <span className="product-card__badge product-card__badge--sale">Sale</span>;
    }
    if (product.tags.includes('new')) {
      return <span className="product-card__badge product-card__badge--new">New</span>;
    }
    if (product.tags.includes('best-seller') || product.tags.includes('sleep') || product.handle === 'berberine-glp1') {
      return <span className="product-card__badge product-card__badge--bestseller">Best Seller</span>;
    }
    return null;
  };

  return (
    <div className="product-card">
      {renderBadge()}

      <Link href={`/shop/${product.handle}`} className="product-card__image-wrap">
        {product.featuredImage ? (
          <Image
            src={product.featuredImage.url}
            alt={product.featuredImage.altText || product.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="product-card__image"
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg-2)' }}>
            <span>No Image</span>
          </div>
        )}

        <button
          className="product-card__quick-add"
          onClick={handleQuickAdd}
          aria-label={`Quick add ${product.title} to cart`}
        >
          <ShoppingCart size={14} style={{ marginRight: 6, display: 'inline', verticalAlign: 'middle' }} />
          Quick Add
        </button>
      </Link>

      <div className="product-card__body">
        <span className="product-card__vendor">{product.vendor}</span>
        <h3 className="product-card__title">
          <Link href={`/shop/${product.handle}`}>{product.title}</Link>
        </h3>

        {/* Testimonial rating stars */}
        <div className="product-card__stars">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={14} fill="var(--color-gold)" stroke="none" />
          ))}
          <span className="product-card__stars-count">(4.9)</span>
        </div>

        <div className="product-card__pricing">
          <span className={`product-card__price${product.isOnSale ? ' product-card__price--sale' : ''}`}>
            {formatPrice(product.price, product.currencyCode)}
          </span>
          {product.isOnSale && product.compareAtPrice && (
            <span className="product-card__compare-price">
              {formatPrice(product.compareAtPrice, product.currencyCode)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
