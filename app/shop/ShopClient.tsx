'use client';

import React, { useState, useMemo } from 'react';
import ProductFilters from '@/components/shop/ProductFilters';
import ProductGrid from '@/components/shop/ProductGrid';
import { Product } from '@/lib/shopify/types';
import { HelpCircle } from 'lucide-react';

interface ShopClientProps {
  initialProducts: Product[];
}

export default function ShopClient({ initialProducts }: ShopClientProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('all');
  const [showOnlySale, setShowOnlySale] = useState<boolean>(false);

  const handleTagChange = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleClearFilters = () => {
    setSelectedTags([]);
    setSelectedPriceRange('all');
    setShowOnlySale(false);
  };

  // Filter products locally based on state
  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      // 1. Tag/Category filter
      if (selectedTags.length > 0) {
        const hasMatchingTag = product.tags.some((tag) => selectedTags.includes(tag.toLowerCase()));
        if (!hasMatchingTag) return false;
      }

      // 2. Price filter
      const price = parseFloat(product.price);
      if (selectedPriceRange === 'under-20' && price >= 20) {
        return false;
      }
      if (selectedPriceRange === '20-25' && (price < 20 || price > 25)) {
        return false;
      }
      if (selectedPriceRange === 'over-25' && price <= 25) {
        return false;
      }

      // 3. Sale filter
      if (showOnlySale && !product.isOnSale) {
        return false;
      }

      return true;
    });
  }, [initialProducts, selectedTags, selectedPriceRange, showOnlySale]);

  return (
    <div className="shop-page">
      <div className="container">
        {/* Page Header */}
        <div className="shop-page__header">
          <h1 className="shop-page__title">Shop All Patches</h1>
          <p className="shop-page__count">
            {filteredProducts.length === 1
              ? 'Showing 1 patch'
              : `Showing ${filteredProducts.length} patches`}
          </p>
        </div>

        {/* Layout with Sidebar & Grid */}
        <div className="shop-page__layout">
          <ProductFilters
            selectedTags={selectedTags}
            onTagChange={handleTagChange}
            selectedPriceRange={selectedPriceRange}
            onPriceRangeChange={setSelectedPriceRange}
            showOnlySale={showOnlySale}
            onShowOnlySaleChange={setShowOnlySale}
            onClearFilters={handleClearFilters}
          />

          <main style={{ width: '100%' }}>
            {filteredProducts.length === 0 ? (
              <div className="no-products" style={{ textAlign: 'center', padding: 'var(--space-4xl) var(--space-xl)' }}>
                <div className="no-products__icon" style={{ margin: '0 auto var(--space-lg)', width: 64, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: 'var(--color-accent-pale)', color: 'var(--color-accent)' }}>
                  <HelpCircle size={28} />
                </div>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--color-dark)', marginBottom: 'var(--space-sm)' }}>No patches match your filters</h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: 'var(--space-lg)' }}>
                  Try choosing different categories or clearing all active filters.
                </p>
                <button className="btn btn-primary btn-sm" onClick={handleClearFilters}>
                  Clear All Filters
                </button>
              </div>
            ) : (
              <ProductGrid products={filteredProducts} />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
