import { NextRequest, NextResponse } from 'next/server';
import { getAllCollections } from '@/lib/shopify';
import { verifyShiprocketRequest } from '@/lib/shiprocket-auth';

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

    const shopifyCollections = await getAllCollections();

    const mappedCollections = shopifyCollections.map((c) => ({
      id: c.id,
      handle: c.handle,
      title: c.title,
      description: c.description || '',
      image_url: c.image?.url || null,
    }));

    return NextResponse.json({
      success: true,
      collections: mappedCollections,
    });
  } catch (error: any) {
    console.error('Shiprocket catalog collections error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Server error' }, { status: 500 });
  }
}
