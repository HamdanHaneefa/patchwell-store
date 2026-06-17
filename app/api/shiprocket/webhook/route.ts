import { NextRequest, NextResponse } from 'next/server';
import { verifyShiprocketRequest } from '@/lib/shiprocket-auth';

/**
 * POST /api/shiprocket/webhook
 *
 * Handles incoming webhooks from Shiprocket One-Click Checkout.
 * Shiprocket sends order and payment status updates here.
 *
 * Payload shape (from Shiprocket docs):
 * {
 *   order_id: string,
 *   status: "CREATED" | "INITIATED" | "FAILED" | "SUCCESS",
 *   source: "web" | "m-web",
 *   payment_type: "CASH_ON_DELIVERY" | "PREPAID",
 *   payment_status: "Pending" | "Success" | "Failed",
 *   customer: { name, phone, email },
 *   shipping_address: { ... },
 *   items: [...],
 *   total_price: number,
 * }
 *
 * Shiprocket expects a 200 response. Webhooks may be sent more than once.
 */
export async function POST(req: NextRequest) {
  // Verify the request is genuinely from Shiprocket
  const isValid = await verifyShiprocketRequest(req);
  if (!isValid) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 511 });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const {
    order_id,
    status,
    payment_type,
    payment_status,
    customer,
    shipping_address,
    items,
    total_price,
  } = body;

  console.log('[Shiprocket Webhook] Received:', {
    order_id,
    status,
    payment_type,
    payment_status,
  });

  // ─── Handle order lifecycle events ───────────────────────────────────────
  switch (status) {
    case 'CREATED':
    case 'INITIATED':
      // Order has been started — no action needed yet
      console.log(`[Shiprocket Webhook] Order ${order_id} initiated (${payment_type})`);
      break;

    case 'SUCCESS':
      // Order placed successfully — handle fulfilment here
      console.log(`[Shiprocket Webhook] Order ${order_id} SUCCESS — payment: ${payment_status}`);

      // TODO (when API keys are live): Create fulfilment in Shopify
      // e.g. createShopifyOrder({ order_id, customer, shipping_address, items, total_price });
      break;

    case 'FAILED':
      console.warn(`[Shiprocket Webhook] Order ${order_id} FAILED — payment: ${payment_status}`);
      // TODO: Notify your team or update order status in DB
      break;

    default:
      console.warn(`[Shiprocket Webhook] Unknown status: ${status}`);
  }

  // Always respond 200 so Shiprocket stops retrying
  return NextResponse.json({ received: true, order_id, status });
}

/**
 * GET /api/shiprocket/webhook
 * Verification endpoint (Shiprocket may ping this to verify the webhook URL).
 */
export async function GET() {
  return NextResponse.json({ status: 'ok', service: 'Patchwell Shiprocket Webhook' });
}
