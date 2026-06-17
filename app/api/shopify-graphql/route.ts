import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || '';
  const accessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || '';

  if (!domain || !accessToken) {
    return NextResponse.json({ error: 'Shopify Storefront API credentials are not configured.' }, { status: 500 });
  }

  try {
    const body = await req.json();
    const endpoint = `https://${domain}/api/2024-01/graphql.json`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': accessToken,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error('Shopify proxy error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
