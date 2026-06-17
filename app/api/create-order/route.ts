import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, currency, receipt } = body;

    // Minimum amount logic (amount in paise, so 100 paise = 1 INR)
    if (!amount || amount < 100) {
      return NextResponse.json({ error: 'Amount must be at least 100 paise' }, { status: 400 });
    }

    const key_id = process.env.RAZORPAY_KEY_ID?.trim();
    const key_secret = process.env.RAZORPAY_KEY_SECRET?.trim();

    if (!key_id || !key_secret) {
      console.error('Razorpay keys are missing from environment');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const instance = new Razorpay({
      key_id,
      key_secret,
    });

    const options = {
      amount,
      currency: currency || 'INR',
      receipt: receipt || `receipt_${Date.now()}`,
    };

    const order = await instance.orders.create(options);

    if (!order) {
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }

    return NextResponse.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error: any) {
    console.error('Razorpay create order error:', error);
    
    // Check for authentication failures
    if (error.statusCode === 401) {
      return NextResponse.json({ error: 'Authentication failed with payment gateway' }, { status: 401 });
    }
    
    return NextResponse.json({ error: error.message || 'Something went wrong' }, { status: 500 });
  }
}
