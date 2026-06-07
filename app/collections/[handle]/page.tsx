import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCollectionByHandle, getAllCollections } from '@/lib/shopify';
import ProductCard from '@/components/shop/ProductCard';

interface Props {
  params: {
    handle: string;
  };
}

// Generate dynamic collection page metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const collection = await getCollectionByHandle(params.handle);

  if (!collection) {
    return {
      title: 'Collection Not Found',
    };
  }

  return {
    title: `${collection.title} Patches`,
    description: collection.description || `Browse our selection of premium transdermal patches for ${collection.title}.`,
  };
}

// Static params generation
export async function generateStaticParams() {
  const collections = await getAllCollections();
  return collections.map((col) => ({
    handle: col.handle,
  }));
}

export default async function CollectionPage({ params }: Props) {
  const collection = await getCollectionByHandle(params.handle);

  if (!collection) {
    notFound();
  }

  return (
    <div className="collection-page" style={{ paddingBottom: 'var(--space-4xl)' }}>
      {/* Banner */}
      <div className="page-hero">
        <div className="container">
          <h1 style={{ textTransform: 'capitalize' }}>{collection.title}</h1>
          <p>{collection.description}</p>
        </div>
      </div>

      {/* Grid */}
      <div className="container" style={{ marginTop: 'var(--space-3xl)' }}>
        {collection.products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-4xl)', color: 'var(--color-text-muted)' }}>
            <p>No products found in this collection.</p>
          </div>
        ) : (
          <div className="products-grid">
            {collection.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
