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

    // Dynamically build redirect and fallback URLs based on request headers
    const host = req.headers.get('host') || 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const siteUrl = `${protocol}://${host}`;

    // Structure checkout request payload for Shiprocket
    const mappedItems = items.map((item: any) => ({
      variant_id: String(item.variantId || item.id),
      quantity: parseInt(item.quantity) || 1,
    }));

    const requestPayload = {
      cart_data: {
        items: mappedItems,
      },
      redirect_url: `${siteUrl}/success`,
      timestamp: new Date().toISOString()
    };

    // If Shiprocket API keys are not configured, bypass and return a mock token for frontend demo mode
    if (!apiKey || !apiSecret) {
      console.warn('Shiprocket API Key or Secret is missing. Returning a mock token for local testing/demo.');
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

      if (!response.ok) {
        console.error('Shiprocket API error response:', responseData);
        // If API fails (e.g. invalid credentials or wallet exhausted), fallback to mock token
        return NextResponse.json({
          token: `mock_token_fail_${Math.random().toString(36).substring(2, 15)}`,
          is_mock: true,
          error: responseData.error || 'API error',
        });
      }

      return NextResponse.json({
        token: responseData.token || responseData.access_token,
        is_mock: false,
      });
    } catch (apiError: any) {
      console.error('Shiprocket API connection failed. Falling back to mock token:', apiError);
      return NextResponse.json({
        token: `mock_token_conn_${Math.random().toString(36).substring(2, 15)}`,
        is_mock: true,
      });
    }
  } catch (error: any) {
    console.error('Error generating checkout access token:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
