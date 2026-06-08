'use client';

interface ProductFiltersProps {
  selectedTags: string[];
  onTagChange: (tag: string) => void;
  selectedPriceRange: string;
  onPriceRangeChange: (range: string) => void;
  showOnlySale: boolean;
  onShowOnlySaleChange: (show: boolean) => void;
  onClearFilters: () => void;
  currencyCode?: string;
}

export default function ProductFilters({
  selectedTags,
  onTagChange,
  selectedPriceRange,
  onPriceRangeChange,
  showOnlySale,
  onShowOnlySaleChange,
  onClearFilters,
  currencyCode = 'INR',
}: ProductFiltersProps) {
  const categories = [
    { label: 'Sleep & Calm', value: 'sleep' },
    { label: 'Energy & Stamina', value: 'energy' },
    { label: 'Focus & Clarity', value: 'focus' },
    { label: 'Relaxation & Calm', value: 'calm' },
  ];

  const isINR = currencyCode === 'INR';
  const priceRanges = [
    { label: 'All Prices', value: 'all' },
    { label: isINR ? 'Under ₹200' : 'Under $20', value: isINR ? 'under-200' : 'under-20' },
    { label: isINR ? '₹200 - ₹500' : '$20 - $25', value: isINR ? '200-500' : '20-25' },
    { label: isINR ? 'Over ₹500' : 'Over $25', value: isINR ? 'over-500' : 'over-25' },
  ];

  return (
    <aside className="filters">
      {/* Category Filter */}
      <div className="filter-group">
        <h3 className="filter-group__title">Categories</h3>
        {categories.map((cat) => (
          <div key={cat.value} className="filter-option">
            <input
              type="checkbox"
              id={`cat-${cat.value}`}
              checked={selectedTags.includes(cat.value)}
              onChange={() => onTagChange(cat.value)}
            />
            <label htmlFor={`cat-${cat.value}`}>{cat.label}</label>
          </div>
        ))}
      </div>

      {/* Price Filter */}
      <div className="filter-group">
        <h3 className="filter-group__title">Price</h3>
        {priceRanges.map((range) => (
          <div key={range.value} className="filter-option" style={{ cursor: 'pointer' }}>
            <input
              type="radio"
              name="price-range"
              id={`price-${range.value}`}
              checked={selectedPriceRange === range.value}
              onChange={() => onPriceRangeChange(range.value)}
              style={{ accentColor: 'var(--color-accent)', cursor: 'pointer', marginRight: 'var(--space-sm)' }}
            />
            <label htmlFor={`price-${range.value}`}>{range.label}</label>
          </div>
        ))}
      </div>

      {/* Sale filter */}
      <div className="filter-group">
        <h3 className="filter-group__title">Offers</h3>
        <div className="filter-option">
          <input
            type="checkbox"
            id="filter-sale"
            checked={showOnlySale}
            onChange={(e) => onShowOnlySaleChange(e.target.checked)}
          />
          <label htmlFor="filter-sale">On Sale Only</label>
        </div>
      </div>

      {/* Reset button */}
      {(selectedTags.length > 0 || selectedPriceRange !== 'all' || showOnlySale) && (
        <button
          className="btn btn-secondary btn-sm btn-full"
          onClick={onClearFilters}
          style={{ marginTop: 'var(--space-md)' }}
        >
          Clear Filters
        </button>
      )}
    </aside>
  );
}
