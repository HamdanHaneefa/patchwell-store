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

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '100', 10);
    const page = parseInt(searchParams.get('page') || '1', 10);

    const shopifyCollections = await getAllCollections();

    const extractId = (gid: any) => {
      if (!gid) return null;
      const parts = String(gid).split('/');
      const lastPart = parts[parts.length - 1];
      const num = parseInt(lastPart, 10);
      return isNaN(num) ? gid : num;
    };

    const mappedCollections = shopifyCollections.map((c) => ({
      id: extractId(c.id),
      updated_at: new Date().toISOString(),
      body_html: c.description ? `<p>${c.description}</p>` : '',
      handle: c.handle,
      image: c.image?.url ? { src: c.image.url } : null,
      title: c.title,
      created_at: new Date().toISOString()
    }));

    return NextResponse.json({
      data: {
        total: mappedCollections.length,
        collections: mappedCollections,
      }
    });
  } catch (error: any) {
    console.error('Shiprocket catalog collections error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Server error' }, { status: 500 });
  }
}
