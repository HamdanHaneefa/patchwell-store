import { NextRequest, NextResponse } from 'next/server';
import { verifyShiprocketRequest } from '@/lib/shiprocket-auth';
import { getAllProducts } from '@/lib/shopify';

/**
 * GET /api/shiprocket/catalog
 *
 * Product catalog endpoint — Shiprocket (fastrr) calls this to sync your
 * product catalogue for their checkout suggestion engine.
 *
 * Shiprocket expects:
 * {
 *   products: Array<{
 *     id: string,              // Unique product ID
 *     name: string,
 *     description: string,
 *     image_url: string,
 *     variants: Array<{
 *       id: string,            // Unique variant ID
 *       name: string,
 *       price: number,
 *       sku: string,
 *       image_url: string,
 *       inventory_quantity: number,
 *     }>,
 *     collections: string[],   // collection IDs this product belongs to
 *   }>
 * }
 *
 * Auth: X-Api-Key + X-Api-HMAC-SHA256 headers (HMAC SHA256 of request body in Base64)
 */
export async function GET(req: NextRequest) {
  const isValid = await verifyShiprocketRequest(req);
  if (!isValid) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 511 });
  }

  try {
    // Fetch live product data from Shopify
    const shopifyProducts = await getAllProducts(100);

    const products = shopifyProducts.map((p: any) => {
      const firstImage = p.images?.[0]?.url || p.featuredImage?.url || '';

      const variants = (p.variants || []).map((v: any) => ({
        id: v.id,
        name: v.title || p.title,
        price: parseFloat(v.price?.amount || v.price || '0'),
        sku: v.sku || v.id,
        image_url: v.image?.url || firstImage,
        inventory_quantity: v.quantityAvailable ?? 99,
      }));

      return {
        id: p.id,
        name: p.title,
        description: p.description || '',
        image_url: firstImage,
        variants,
        collections: (p.collections || []).map((c: any) => c.id || c),
      };
    });

    return NextResponse.json({
      products,
      total: products.length,
      synced_at: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('[Shiprocket Catalog] Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch catalog', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/shiprocket/catalog
 *
 * Shiprocket may also POST to fetch catalog by specific variant IDs.
 * Request body: { variant_ids: string[] }
 */
export async function POST(req: NextRequest) {
  const isValid = await verifyShiprocketRequest(req);
  if (!isValid) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 511 });
  }

  let variantIds: string[] = [];
  try {
    const body = await req.json();
    variantIds = body.variant_ids || [];
  } catch {
    // If no body, fall through and return all products
  }

  try {
    const shopifyProducts = await getAllProducts(100);

    let products = shopifyProducts.map((p: any) => {
      const firstImage = p.images?.[0]?.url || p.featuredImage?.url || '';
      const variants = (p.variants || []).map((v: any) => ({
        id: v.id,
        name: v.title || p.title,
        price: parseFloat(v.price?.amount || v.price || '0'),
        sku: v.sku || v.id,
        image_url: v.image?.url || firstImage,
        inventory_quantity: v.quantityAvailable ?? 99,
      }));

      return {
        id: p.id,
        name: p.title,
        description: p.description || '',
        image_url: firstImage,
        variants,
        collections: (p.collections || []).map((c: any) => c.id || c),
      };
    });

    // Filter by requested variant IDs if provided
    if (variantIds.length > 0) {
      products = products.filter((p: any) =>
        p.variants.some((v: any) => variantIds.includes(v.id))
      );
    }

    return NextResponse.json({ products, total: products.length });
  } catch (error: any) {
    console.error('[Shiprocket Catalog POST] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch catalog', details: error.message },
      { status: 500 }
    );
  }
}
