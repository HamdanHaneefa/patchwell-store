import { Metadata } from 'next';
import { getAllProducts } from '@/lib/shopify';
import ShopClient from './ShopClient';

export const metadata: Metadata = {
  title: 'Shop All Patches',
  description: 'Browse our full catalog of premium wellness patches. Find slow-release, drug-free solutions for sleep, energy, focus, and calm.',
};

export default async function ShopPage() {
  const products = await getAllProducts(50); // Get up to 50 products

  return <ShopClient initialProducts={products} />;
}
