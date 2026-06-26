import { NextRequest, NextResponse } from 'next/server';
import { getCollectionByHandle, getAllProducts, getAllCollections } from '@/lib/shopify';
import { verifyShiprocketRequest } from '@/lib/shiprocket-auth';
import { Product } from '@/lib/shopify/types';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, x-api-key, x-api-hmac-sha256',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

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
      return NextResponse.json(
        { success: false, error: 'Unauthorized', data: { total: 0, products: [] } },
        { status: 401, headers: corsHeaders }
      );
    }

    const { searchParams } = new URL(req.url);
    const collectionParam = searchParams.get('collection_id') || searchParams.get('handle') || searchParams.get('id');
    const limit = parseInt(searchParams.get('limit') || '100', 10);
    const page = parseInt(searchParams.get('page') || '1', 10);

    if (!collectionParam) {
      return NextResponse.json(
        { success: false, error: 'Missing collection identifier (collection_id, handle, or id)', data: { total: 0, products: [] } },
        { status: 400, headers: corsHeaders }
      );
    }

    let products: Product[] = [];
    let collection = await getCollectionByHandle(collectionParam);

    // If fetching by handle failed, it might be a numeric ID. Find the collection by ID.
    if (!collection || !collection.products || collection.products.length === 0) {
      const allCollections = await getAllCollections();
      const matched = allCollections.find(c => String(c.id).includes(collectionParam));
      if (matched) {
        collection = await getCollectionByHandle(matched.handle);
      }
    }

    if (collection && collection.products) {
      products = collection.products;
    } else if (collectionParam === 'all' || collectionParam === 'all-products') {
      products = await getAllProducts(limit);
    }

    const extractId = (gid: any) => {
      if (!gid) return null;
      const parts = String(gid).split('/');
      const lastPart = parts[parts.length - 1];
      const num = parseInt(lastPart, 10);
      return isNaN(num) ? gid : num;
    };

    const mappedProducts = products.map((p: any) => {
      const variants = (p.variants || []).map((v: any) => {
        const variantPrice = String(v.price?.amount ?? v.price ?? '0.00');
        const variantComparePrice = v.compareAtPrice ? String(v.compareAtPrice.amount ?? v.compareAtPrice) : null;
        
        let optionValues: any = {};
        if (v.selectedOptions) {
          v.selectedOptions.forEach((opt: any) => {
            if (opt.name !== 'Title' || opt.value !== 'Default Title') {
              optionValues[opt.name] = opt.value;
            }
          });
        }
        
        const variantObj: any = {
          id: extractId(v.id),
          title: v.title || 'Default Title',
          price: variantPrice,
          compare_at_price: variantComparePrice,
          sku: v.sku || String(extractId(v.id)),
          quantity: v.availableForSale ? 100 : 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          taxable: true,
          grams: 500,
          image: p.featuredImage ? { src: p.featuredImage.url } : null,
          weight: 1.0,
          weight_unit: "kg"
        };

        if (Object.keys(optionValues).length > 0) {
          variantObj.option_values = optionValues;
        }

        return variantObj;
      });

      let options: any[] = [];
      if (p.variants && p.variants.length > 0 && p.variants[0].selectedOptions) {
        const optionNames = p.variants[0].selectedOptions
          .map((o: any) => o.name)
          .filter((name: string) => name !== 'Title');
        
        optionNames.forEach((name: string) => {
          const values = new Set();
          p.variants.forEach((v: any) => {
            const opt = v.selectedOptions?.find((o: any) => o.name === name);
            if (opt && opt.value !== 'Default Title') {
              values.add(opt.value);
            }
          });
          options.push({ name, values: Array.from(values) });
        });
      }

      const productImages = (p.images && p.images.length > 0)
        ? p.images.map((img: any) => ({ src: img.url || img.src }))
        : (p.featuredImage ? [{ src: p.featuredImage.url }] : []);

      const productObj: any = {
        id: extractId(p.id),
        title: p.title,
        body_html: (p.descriptionHtml && p.descriptionHtml.trim() !== '')
          ? p.descriptionHtml
          : (p.description && p.description.trim() !== '' ? `<p>${p.description}</p>` : `<p>${p.title}</p>`),
        vendor: p.vendor || 'Patchwell',
        product_type: p.productType || 'Wellness Patches',
        created_at: new Date().toISOString(),
        handle: p.handle,
        updated_at: new Date().toISOString(),
        tags: Array.isArray(p.tags) ? p.tags.join(', ') : (p.tags || ''),
        status: (p.availableForSale ?? true) ? "active" : "draft",
        variants: variants,
        image: p.featuredImage ? { src: p.featuredImage.url } : null,
        images: productImages,
      };

      if (options.length > 0) {
        productObj.options = options;
      }

      return productObj;
    });

    return NextResponse.json({
      data: {
        total: mappedProducts.length,
        products: mappedProducts,
      }
    }, { headers: corsHeaders });
  } catch (error: any) {
    console.error('Shiprocket catalog products-by-collection error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Server error', data: { total: 0, products: [] } },
      { status: 500, headers: corsHeaders }
    );
  }
}
