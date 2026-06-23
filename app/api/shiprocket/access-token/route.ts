import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, subtotal, currency } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    const apiKey = process.env.SHIPROCKET_API_KEY?.trim();
    const apiSecret = process.env.SHIPROCKET_API_SECRET?.trim();

    // Dynamically build redirect URL based on request headers
    const host = req.headers.get('host') || 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const siteUrl = `${protocol}://${host}`;

    const extractId = (gid: any) => {
      if (!gid) return null;
      const parts = String(gid).split('/');
      const lastPart = parts[parts.length - 1];
      const num = parseInt(lastPart, 10);
      return isNaN(num) ? gid : num;
    };

    // Structure checkout request payload per Shiprocket docs
    const mappedItems = items.map((item: any) => ({
      variant_id: extractId(item.variantId || item.id),
      quantity: parseInt(item.quantity) || 1,
    }));

    const requestPayload = {
      cart_data: {
        items: mappedItems,
        custom_attributes: {},
        mobile_app: false,
      },
      redirect_url: `${siteUrl}/order-success`,
      timestamp: new Date().toISOString(),
    };

    // If Shiprocket API keys are not configured, return mock token for demo mode
    if (!apiKey || !apiSecret) {
      console.warn('Shiprocket API Key or Secret is missing. Returning a mock token.');
      return NextResponse.json({
        token: `mock_token_${Math.random().toString(36).substring(2, 15)}`,
        is_mock: true,
      });
    }

    const payloadString = JSON.stringify(requestPayload);

    // Calculate HMAC SHA256 in Base64 using Secret Key
    const signature = crypto
      .createHmac('sha256', apiSecret)
      .update(payloadString)
      .digest('base64');

    try {
      // Call Shiprocket Checkout Access Token API
      const response = await fetch('https://checkout-api.shiprocket.com/api/v1/access-token/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': apiKey,
          'X-Api-HMAC-SHA256': signature,
        },
        body: payloadString,
      });

      const responseData = await response.json();

      if (!response.ok || !responseData.ok) {
        console.error('Shiprocket API error response:', responseData);
        return NextResponse.json({
          token: `mock_token_fail_${Math.random().toString(36).substring(2, 15)}`,
          is_mock: true,
          error: responseData.error || JSON.stringify(responseData),
        });
      }

      // Per docs: response is { ok: true, result: { token: "...", expires_at: "...", data: { order_id: "..." } } }
      const token = responseData.result?.token;
      if (!token) {
        console.error('Shiprocket API did not return a token. Full response:', responseData);
        return NextResponse.json({
          token: `mock_token_notoken_${Math.random().toString(36).substring(2, 15)}`,
          is_mock: true,
          error: 'No token in Shiprocket response',
        });
      }

      return NextResponse.json({
        token: token,
        is_mock: false,
        order_id: responseData.result?.data?.order_id,
      });
    } catch (apiError: any) {
      console.error('Shiprocket API connection failed:', apiError);
      return NextResponse.json({
        token: `mock_token_conn_${Math.random().toString(36).substring(2, 15)}`,
        is_mock: true,
        error: apiError.message,
      });
    }
  } catch (error: any) {
    console.error('Error generating checkout access token:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
