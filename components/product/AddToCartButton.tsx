'use client';

import { ShoppingCart } from 'lucide-react';

interface AddToCartButtonProps {
  onClick: () => void;
  disabled: boolean;
  isAdding: boolean;
  availableForSale: boolean;
}

export default function AddToCartButton({
  onClick,
  disabled,
  isAdding,
  availableForSale,
}: AddToCartButtonProps) {
  return (
    <button
      className="btn btn-primary btn-lg"
      onClick={onClick}
      disabled={disabled || !availableForSale}
      style={{ flex: 1, height: 48 }}
    >
      <ShoppingCart size={16} style={{ marginRight: 8, display: 'inline', verticalAlign: 'middle' }} />
      {isAdding ? 'Adding...' : availableForSale ? 'Add to Cart' : 'Out of Stock'}
    </button>
  );
}
