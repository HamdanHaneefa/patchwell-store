import { NextRequest, NextResponse } from 'next/server';
import { getAllProducts } from '@/lib/shopify';
import { verifyShiprocketRequest } from '@/lib/shiprocket-auth';

export async function POST(req: NextRequest) {
  return handleProductsRequest(req);
}

export async function GET(req: NextRequest) {
  return handleProductsRequest(req);
}

async function handleProductsRequest(req: NextRequest) {
  try {
    const isValid = await verifyShiprocketRequest(req);
    if (!isValid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const shopifyProducts = await getAllProducts(100);

    const extractId = (gid: any) => {
      if (!gid) return null;
      const parts = String(gid).split('/');
      const lastPart = parts[parts.length - 1];
      const num = parseInt(lastPart, 10);
      return isNaN(num) ? gid : num;
    };

    const mappedProducts = shopifyProducts.map((p: any) => {
      // Normalize variants
      const variants = (p.variants || []).map((v: any) => {
        const variantPrice = typeof v.price === 'string' ? v.price : (v.price?.amount || '0.00');
        const variantComparePrice = v.compareAtPrice ? (typeof v.compareAtPrice === 'string' ? v.compareAtPrice : v.compareAtPrice.amount) : null;
        
        let optionValues: any = {};
        if (v.selectedOptions) {
          v.selectedOptions.forEach((opt: any) => {
            optionValues[opt.name] = opt.value;
          });
        }
        
        return {
          id: extractId(v.id),
          title: v.title,
          price: variantPrice,
          compare_at_price: variantComparePrice,
          sku: v.sku || String(extractId(v.id)),
          quantity: v.availableForSale ? 100 : 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          taxable: true,
          option_values: optionValues,
          grams: 500,
          image: p.featuredImage ? { src: p.featuredImage.url } : null,
          weight: 1.0,
          weight_unit: "kg"
        };
      });

      let options: any[] = [];
      if (p.variants && p.variants.length > 0 && p.variants[0].selectedOptions) {
          const optionNames = p.variants[0].selectedOptions.map((o: any) => o.name);
          optionNames.forEach((name: string) => {
              const values = new Set();
              p.variants.forEach((v: any) => {
                  const opt = v.selectedOptions?.find((o: any) => o.name === name);
                  if (opt) values.add(opt.value);
              });
              options.push({ name, values: Array.from(values) });
          });
      }

      return {
        id: extractId(p.id),
        title: p.title,
        body_html: p.descriptionHtml || `<p>${p.description}</p>`,
        vendor: p.vendor || 'Patchwell',
        product_type: p.productType || 'Wellness Patches',
        created_at: new Date().toISOString(),
        handle: p.handle,
        updated_at: new Date().toISOString(),
        tags: Array.isArray(p.tags) ? p.tags.join(', ') : (p.tags || ''),
        status: (p.availableForSale ?? true) ? "active" : "draft",
        variants: variants,
        image: p.featuredImage ? { src: p.featuredImage.url } : null,
        options: options,
      };
    });

    return NextResponse.json({
      data: {
        total: mappedProducts.length,
        products: mappedProducts,
      }
    });
  } catch (error: any) {
    console.error('Shiprocket catalog products error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Server error' }, { status: 500 });
  }
}
