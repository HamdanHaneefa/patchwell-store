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

    const mappedProducts = shopifyProducts.map((p) => {
      // Normalize variants
      const variants = (p.variants || []).map((v) => {
        const variantPrice = parseFloat(v.price.amount);
        const variantComparePrice = v.compareAtPrice ? parseFloat(v.compareAtPrice.amount) : null;
        
        return {
          id: v.id,
          title: v.title,
          price: variantPrice,
          compare_at_price: variantComparePrice,
          sku: v.id, // Using variant ID as SKU fallback
          available: v.availableForSale ?? true,
          quantity: v.availableForSale ? 100 : 0, // Fallback quantity
        };
      });

      const images = (p.images || []).map((img) => ({
        url: img.url,
        alt: img.altText || p.title,
      }));

      // If no images exist but featured image is available, add it
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
      products: mappedProducts,
    });
  } catch (error: any) {
    console.error('Shiprocket catalog products error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Server error' }, { status: 500 });
  }
}
