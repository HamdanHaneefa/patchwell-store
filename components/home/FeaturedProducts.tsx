import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getAllProducts } from '@/lib/shopify';
import ProductCard from '@/components/shop/ProductCard';

export default async function FeaturedProducts() {
  const products = await getAllProducts(4);

  return (
    <section className="products-section">
      <div className="container">
        <div className="section-header">
          <span className="section-header__tag">Customer Favorites</span>
          <h2>Shop Our Best Sellers</h2>
          <p>
            Experience continuous 8-12 hour relief. Our patches are formulated with premium, bioavailable ingredients that absorb directly into the bloodstream.
          </p>
        </div>

        <div className="products-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 'var(--space-3xl)' }}>
          <Link href="/shop" className="btn btn-secondary">
            View All Patches
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
