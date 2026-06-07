import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProductByHandle, getAllProducts } from '@/lib/shopify';
import ProductDetailClient from './ProductDetailClient';

interface Props {
  params: {
    handle: string;
  };
}

// Generate dynamic SEO metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProductByHandle(params.handle);

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  return {
    title: product.title,
    description: product.description,
    openGraph: {
      title: product.title,
      description: product.description,
      images: product.featuredImage ? [{ url: product.featuredImage.url }] : [],
    },
  };
}

// Pre-generate static paths for Shopify or mock handles
export async function generateStaticParams() {
  const products = await getAllProducts(100);
  return products.map((product) => ({
    handle: product.handle,
  }));
}

export default async function ProductPage({ params }: Props) {
  const product = await getProductByHandle(params.handle);

  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}
