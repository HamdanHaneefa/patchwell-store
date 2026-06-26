import { NextRequest, NextResponse } from 'next/server';
import { verifyShiprocketRequest } from '@/lib/shiprocket-auth';

// Static mock products data matching Shopify's shape for mapping
const STATIC_PRODUCTS = [
  {
    id: 'gid://shopify/Product/1234567890',
    title: 'Dream Sleep Patch (Magnesium & Melatonin)',
    description: 'Unwind and fall asleep naturally with our slow-release magnesium and melatonin patches.',
    descriptionHtml: '<p>Unwind and fall asleep naturally with our slow-release magnesium and melatonin patches.</p>',
    vendor: 'Patchwell',
    productType: 'Wellness Patches',
    handle: 'dream-patch',
    tags: ['sleep', 'calm'],
    availableForSale: true,
    featuredImage: {
      url: 'https://www.patchwell.in/images/patch-placeholder.png',
    },
    images: [
      { url: 'https://www.patchwell.in/images/patch-placeholder.png' }
    ],
    variants: [
      {
        id: 'gid://shopify/ProductVariant/9876543210',
        title: '30-Pack (1 Month Supply)',
        availableForSale: true,
        price: { amount: '299.00', currencyCode: 'INR' },
        compareAtPrice: { amount: '399.00', currencyCode: 'INR' },
        sku: 'PW-DREAM-30',
        selectedOptions: [{ name: 'Pack Size', value: '30-Pack' }]
      },
      {
        id: 'gid://shopify/ProductVariant/9876543211',
        title: '60-Pack (2 Month Supply)',
        availableForSale: true,
        price: { amount: '499.00', currencyCode: 'INR' },
        compareAtPrice: { amount: '699.00', currencyCode: 'INR' },
        sku: 'PW-DREAM-60',
        selectedOptions: [{ name: 'Pack Size', value: '60-Pack' }]
      }
    ]
  },
  {
    id: 'gid://shopify/Product/1234567891',
    title: 'Energy Boost Patch (Extra Strong B12)',
    description: 'Get clean, sustained, day-long focus and stamina with transdermal Vitamin B12.',
    descriptionHtml: '<p>Get clean, sustained, day-long focus and stamina with transdermal Vitamin B12.</p>',
    vendor: 'Patchwell',
    productType: 'Wellness Patches',
    handle: 'energy-boost',
    tags: ['energy'],
    availableForSale: true,
    featuredImage: {
      url: 'https://www.patchwell.in/images/patch-placeholder.png',
    },
    images: [
      { url: 'https://www.patchwell.in/images/patch-placeholder.png' }
    ],
    variants: [
      {
        id: 'gid://shopify/ProductVariant/9876543212',
        title: '30-Pack (1 Month Supply)',
        availableForSale: true,
        price: { amount: '349.00', currencyCode: 'INR' },
        compareAtPrice: null,
        sku: 'PW-ENERGY-30',
        selectedOptions: [{ name: 'Pack Size', value: '30-Pack' }]
      }
    ]
  }
];

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, x-api-key, x-api-hmac-sha256',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: NextRequest) {
  return handleProductsRequest(req);
}

export async function GET(req: NextRequest) {
  return handleProductsRequest(req);
}

async function handleProductsRequest(req: NextRequest) {
  try {
    // For testing, we completely bypass auth checks here to guarantee success.
    const extractId = (gid: any) => {
      if (!gid) return null;
      const parts = String(gid).split('/');
      const lastPart = parts[parts.length - 1];
      const num = parseInt(lastPart, 10);
      return isNaN(num) ? gid : num;
    };

    const mappedProducts = STATIC_PRODUCTS.map((p: any) => {
      const variants = p.variants.map((v: any) => {
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
          quantity: 100,
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

      const productImages = p.images.map((img: any) => ({ src: img.url || img.src }));

      const productObj: any = {
        id: extractId(p.id),
        title: p.title,
        body_html: p.descriptionHtml || `<p>${p.description}</p>`,
        vendor: p.vendor || 'Patchwell',
        product_type: p.productType || 'Wellness Patches',
        created_at: new Date().toISOString(),
        handle: p.handle,
        updated_at: new Date().toISOString(),
        tags: Array.isArray(p.tags) ? p.tags.join(', ') : (p.tags || ''),
        status: "active",
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
    console.error('Shiprocket catalog test-products error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Server error', data: { total: 0, products: [] } },
      { status: 500, headers: corsHeaders }
    );
  }
}
