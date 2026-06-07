'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { CartItem as CartItemType } from '@/lib/shopify/types';
import { formatPrice } from '@/lib/shopify';

interface CartItemProps {
  item: CartItemType;
  onQuantityChange: (lineId: string, currentQty: number, change: number) => Promise<void>;
  onRemove: (lineId: string) => Promise<void>;
}

export default function CartItem({
  item,
  onQuantityChange,
  onRemove,
}: CartItemProps) {
  return (
    <div className="cart-item">
      {item.image ? (
        <Image
          src={item.image.url}
          alt={item.image.altText || item.productTitle}
          width={80}
          height={80}
          className="cart-item__image"
        />
      ) : (
        <div className="cart-item__image" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg-3)' }}>
          <ShoppingBag size={24} style={{ color: 'var(--color-text-light)' }} />
        </div>
      )}

      <div className="cart-item__details">
        <h4 className="cart-item__title">
          <Link href={`/shop/${item.productHandle}`}>
            {item.productTitle}
          </Link>
        </h4>
        {item.variantTitle && item.variantTitle !== 'Default Title' && (
          <span className="cart-item__variant">{item.variantTitle}</span>
        )}
        <span className="cart-item__price">
          {formatPrice(item.price, item.currencyCode)}
        </span>
      </div>

      <div className="cart-item__actions">
        <button
          className="cart-item__remove"
          onClick={() => onRemove(item.id)}
          aria-label="Remove item"
        >
          <Trash2 size={16} />
        </button>

        <div className="quantity-control">
          <button
            className="quantity-control__btn"
            onClick={() => onQuantityChange(item.id, item.quantity, -1)}
            aria-label="Decrease quantity"
          >
            <Minus size={12} />
          </button>
          <span className="quantity-control__value">{item.quantity}</span>
          <button
            className="quantity-control__btn"
            onClick={() => onQuantityChange(item.id, item.quantity, 1)}
            aria-label="Increase quantity"
          >
            <Plus size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
