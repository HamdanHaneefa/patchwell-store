import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const key_secret = process.env.RAZORPAY_KEY_SECRET?.trim();

    if (!key_secret) {
      console.error('Razorpay key secret is missing from environment');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const generated_signature = crypto
      .createHmac('sha256', key_secret)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (generated_signature !== razorpay_signature) {
      return NextResponse.json({ error: 'Payment verification failed: Signature mismatch' }, { status: 400 });
    }

    // Payment is verified
    return NextResponse.json({ success: true, message: 'Payment verified successfully' });
  } catch (error: any) {
    console.error('Razorpay verify payment error:', error);
    return NextResponse.json({ error: error.message || 'Something went wrong' }, { status: 500 });
  }
}
