import { NextRequest, NextResponse } from 'next/server';
import { getCollectionByHandle, getAllProducts } from '@/lib/shopify';
import { verifyShiprocketRequest } from '@/lib/shiprocket-auth';
import { Product } from '@/lib/shopify/types';

export async function POST(req: NextRequest) {
  return handleRequest(req);
}

export async function GET(req: NextRequest) {
  return handleRequest(req);
}

async function handleRequest(req: NextRequest) {
  try {
    const isValid = await verifyShiprocketRequest(req);
    if (!isValid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const collectionParam = searchParams.get('collection_id') || searchParams.get('handle') || searchParams.get('id');

    if (!collectionParam) {
      return NextResponse.json({ error: 'Missing collection identifier (collection_id, handle, or id)' }, { status: 400 });
    }

    let products: Product[] = [];
    const collection = await getCollectionByHandle(collectionParam);

    if (collection && collection.products) {
      products = collection.products;
    } else if (collectionParam === 'all' || collectionParam === 'all-products') {
      products = await getAllProducts(100);
    }

    const mappedProducts = products.map((p) => {
      const variants = (p.variants || []).map((v) => {
        const variantPrice = parseFloat(v.price.amount);
        const variantComparePrice = v.compareAtPrice ? parseFloat(v.compareAtPrice.amount) : null;

        return {
          id: v.id,
          title: v.title,
          price: variantPrice,
          compare_at_price: variantComparePrice,
          sku: v.id,
          available: v.availableForSale ?? true,
          quantity: v.availableForSale ? 100 : 0,
        };
      });

      const images = (p.images || []).map((img) => ({
        url: img.url,
        alt: img.altText || p.title,
      }));

      if (images.length === 0 && p.featuredImage) {
        images.push({
          url: p.featuredImage.url,
          alt: p.featuredImage.altText || p.title,
        });
      }

      const defaultPrice = parseFloat(p.price);
      const defaultComparePrice = p.compareAtPrice ? parseFloat(p.compareAtPrice) : null;

      return {
        id: p.id,
        handle: p.handle,
        title: p.title,
        description: p.description,
        description_html: p.descriptionHtml,
        price: defaultPrice,
        compare_at_price: defaultComparePrice,
        currency: p.currencyCode || 'INR',
        images: images,
        variants: variants,
        vendor: p.vendor || 'Patchwell',
        product_type: p.productType || 'Wellness Patches',
        available: p.availableForSale ?? true,
      };
    });

    return NextResponse.json({
      success: true,
      collection: collection ? {
        id: collection.id,
        handle: collection.handle,
        title: collection.title,
        description: collection.description,
      } : null,
      products: mappedProducts,
    });
  } catch (error: any) {
    console.error('Shiprocket catalog products-by-collection error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Server error' }, { status: 500 });
  }
}
