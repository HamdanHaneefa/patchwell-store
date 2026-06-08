'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { searchProducts, getAllProducts } from '@/lib/shopify';
import { Product } from '@/lib/shopify/types';
import ProductCard from '@/components/shop/ProductCard';
import { Search } from 'lucide-react';

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<Product[]>([]);
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchSearch() {
      setLoading(true);
      try {
        if (query) {
          const res = await searchProducts(query);
          setResults(res);
          if (res.length === 0) {
            const recs = await getAllProducts(4);
            setRecommendations(recs);
          }
        } else {
          setResults([]);
          const recs = await getAllProducts(4);
          setRecommendations(recs);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchSearch();
  }, [query]);

  return (
    <div className="container" style={{ marginTop: 'var(--space-3xl)' }}>
      {/* Search Bar Input Form */}
      <form
        action="/search"
        method="GET"
        style={{
          maxWidth: 500,
          margin: '0 auto var(--space-3xl)',
          display: 'flex',
          gap: 'var(--space-sm)',
          background: 'var(--color-white)',
          padding: '4px 4px 4px 16px',
          borderRadius: 'var(--radius-full)',
          border: '1px solid var(--color-border)',
          alignItems: 'center',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <Search size={18} style={{ color: 'var(--color-text-muted)' }} />
        <input
          type="text"
          name="q"
          defaultValue={query}
          placeholder="Search patches (e.g. sleep, energy, berberine)..."
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            fontSize: '0.95rem',
            color: 'var(--color-dark)',
            height: 40,
          }}
        />
        <button
          type="submit"
          className="btn btn-primary"
          style={{ padding: '0 1.25rem', height: 38 }}
        >
          Search
        </button>
      </form>

      {loading ? (
        <div style={{ textAlign: 'center', margin: 'var(--space-4xl) 0' }}>
          <p style={{ color: 'var(--color-text-muted)' }}>Searching patches...</p>
        </div>
      ) : query && results.length === 0 ? (
        <div style={{ textAlign: 'center', margin: 'var(--space-4xl) 0' }}>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-2xl)' }}>
            No patches found matching &ldquo;{query}&rdquo;.
          </p>

          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-dark)', marginBottom: 'var(--space-xl)' }}>
            Recommended for You
          </h3>
          <div className="products-grid">
            {recommendations.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      ) : !query ? (
        <div>
          <h3 style={{ textAlign: 'center', fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-dark)', marginBottom: 'var(--space-xl)' }}>
            Popular Patches
          </h3>
          <div className="products-grid">
            {recommendations.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      ) : (
        <div className="products-grid">
          {results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

function SearchPageHero() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  return (
    <div className="page-hero">
      <div className="container">
        <h1>Search Results</h1>
        <p>
          {query
            ? `Showing results for "${query}"`
            : 'Find the perfect wellness patch for your needs.'}
        </p>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <div className="search-page" style={{ paddingBottom: 'var(--space-4xl)' }}>
      <Suspense fallback={
        <div className="page-hero">
          <div className="container">
            <h1>Search Results</h1>
            <p>Find the perfect wellness patch for your needs.</p>
          </div>
        </div>
      }>
        <SearchPageHero />
      </Suspense>

      <Suspense fallback={
        <div className="container" style={{ marginTop: 'var(--space-3xl)', textAlign: 'center' }}>
          <p>Loading...</p>
        </div>
      }>
        <SearchResults />
      </Suspense>
    </div>
  );
}
