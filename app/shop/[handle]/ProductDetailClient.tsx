'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Minus, Plus } from 'lucide-react';
import { Product } from '@/lib/shopify/types';
import { useCart } from '@/context/CartContext';
import ProductImages from '@/components/product/ProductImages';
import ProductInfo from '@/components/product/ProductInfo';
import VariantSelector from '@/components/product/VariantSelector';
import AddToCartButton from '@/components/product/AddToCartButton';

interface ProductDetailClientProps {
  product: Product;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const { addToCart, openCart } = useCart();
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const images = product.images.length > 0 ? product.images : [product.featuredImage].filter(Boolean) as typeof product.images;

  const handleVariantChange = (variantId: string) => {
    const variant = product.variants.find((v) => v.id === variantId);
    if (variant) {
      setSelectedVariant(variant);
    }
  };

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    setIsAdding(true);
    try {
      await addToCart(selectedVariant.id, quantity);
      openCart();
    } finally {
      setIsAdding(false);
    }
  };

  const price = selectedVariant?.price.amount ?? product.price;
  const compareAtPrice = selectedVariant?.compareAtPrice?.amount ?? product.compareAtPrice;

  return (
    <div className="product-detail">
      <div className="container">
        {/* Breadcrumbs */}
        <nav className="breadcrumb" aria-label="Breadcrumb" style={{ marginBottom: 'var(--space-lg)' }}>
          <Link href="/">Home</Link>
          <span className="breadcrumb__sep">/</span>
          <Link href="/shop">Shop</Link>
          <span className="breadcrumb__sep">/</span>
          <span>{product.title}</span>
        </nav>

        <div className="product-detail__inner">
          {/* Left Column: Image Gallery */}
          <ProductImages
            images={images}
            productTitle={product.title}
            activeImageIndex={activeImageIndex}
            setActiveImageIndex={setActiveImageIndex}
          />

          {/* Right Column: Information */}
          <ProductInfo
            title={product.title}
            vendor={product.vendor}
            description={product.description}
            descriptionHtml={product.descriptionHtml}
            price={price}
            compareAtPrice={compareAtPrice}
            currencyCode={selectedVariant?.price.currencyCode || product.currencyCode}
          >
            {/* Variants Selector */}
            <VariantSelector
              variants={product.variants}
              selectedVariant={selectedVariant}
              onVariantChange={handleVariantChange}
            />

            {/* Add to Cart Actions Row */}
            <div className="product-detail__add-row" style={{ marginTop: 'var(--space-md)' }}>
              {/* Quantity Selector */}
              <div className="quantity-control" style={{ height: 48 }}>
                <button
                  className="quantity-control__btn"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  aria-label="Decrease quantity"
                  style={{ width: 44, height: 46 }}
                >
                  <Minus size={14} />
                </button>
                <span className="quantity-control__value" style={{ minWidth: 40, fontSize: '1.1rem' }}>
                  {quantity}
                </span>
                <button
                  className="quantity-control__btn"
                  onClick={() => setQuantity(quantity + 1)}
                  aria-label="Increase quantity"
                  style={{ width: 44, height: 46 }}
                >
                  <Plus size={14} />
                </button>
              </div>

              {/* Add Button */}
              <AddToCartButton
                onClick={handleAddToCart}
                disabled={isAdding || !product.availableForSale}
                isAdding={isAdding}
                availableForSale={product.availableForSale}
              />
            </div>
          </ProductInfo>
        </div>
      </div>
    </div>
  );
}
