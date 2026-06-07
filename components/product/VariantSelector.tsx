'use client';

import { ShopifyVariant } from '@/lib/shopify/types';
import { formatPrice } from '@/lib/shopify';

interface VariantSelectorProps {
  variants: ShopifyVariant[];
  selectedVariant: ShopifyVariant;
  onVariantChange: (variantId: string) => void;
}

export default function VariantSelector({
  variants,
  selectedVariant,
  onVariantChange,
}: VariantSelectorProps) {
  if (variants.length <= 1) return null;

  return (
    <div className="product-detail__variants">
      <span className="variant-group__label">Choose Pack Size</span>
      <div className="variant-group__options">
        {variants.map((variant) => (
          <button
            key={variant.id}
            className={`variant-option${selectedVariant.id === variant.id ? ' selected' : ''}`}
            onClick={() => onVariantChange(variant.id)}
          >
            {variant.title} - {formatPrice(variant.price.amount, variant.price.currencyCode)}
          </button>
        ))}
      </div>
    </div>
  );
}
