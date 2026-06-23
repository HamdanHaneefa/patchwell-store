import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/shiprocket/webhook
 *
 * Handles incoming order webhooks from Shiprocket One-Click Checkout.
 *
 * Per docs, Shiprocket POSTs order details with:
 * - order_id, status, cart_data, shipping_address, billing_address, 
 *   payment_type, payment_status, payments, total_amount_payable, etc.
 *
 * Shiprocket expects a 200 response. Webhooks may be sent more than once.
 */
export async function POST(req: NextRequest) {
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
    phone,
    email,
    shipping_address,
    billing_address,
    cart_data,
    subtotal_price,
    total_amount_payable,
    shipping_charges,
    fastrr_order_id,
    payments,
    coupon_codes,
    total_discount,
  } = body;

  console.log('[Shiprocket Webhook] Received:', {
    order_id,
    status,
    payment_type,
    payment_status,
    phone,
    email,
    fastrr_order_id,
    total_amount_payable,
  });

  // Handle order lifecycle events
  switch (status) {
    case 'SUCCESS':
      console.log(`[Shiprocket Webhook] Order ${order_id} SUCCESS — payment: ${payment_status}, amount: ${total_amount_payable}`);
      // TODO: Create order in your database / Shopify admin
      // TODO: Send order confirmation email to customer
      break;

    case 'FAILED':
      console.warn(`[Shiprocket Webhook] Order ${order_id} FAILED — payment: ${payment_status}`);
      // TODO: Notify team about failed order
      break;

    case 'CREATED':
    case 'INITIATED':
      console.log(`[Shiprocket Webhook] Order ${order_id} ${status} (${payment_type})`);
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
