import { NextRequest } from 'next/server';
import crypto from 'crypto';

/**
 * Helper to verify that an incoming request from Shiprocket has a valid API Key and HMAC signature.
 * 
 * If SHIPROCKET_API_KEY or SHIPROCKET_API_SECRET are not set in the environment,
 * this function allows the request through (returning true) with a console warning.
 * This ensures the integration works out-of-the-box in development.
 */
export async function verifyShiprocketRequest(req: NextRequest): Promise<boolean> {
  const apiKeyEnv = process.env.SHIPROCKET_API_KEY?.trim();
  const apiSecretEnv = process.env.SHIPROCKET_API_SECRET?.trim();

  // If credentials are not configured, log a warning but bypass verification for easy development/testing
  if (!apiKeyEnv || !apiSecretEnv) {
    console.warn('Shiprocket API Key or Secret not configured in environment. Bypassing signature verification.');
    return true;
  }

  const headerApiKey = req.headers.get('x-api-key') || '';
  const headerSignature = req.headers.get('x-api-hmac-sha256') || '';

  if (headerApiKey !== apiKeyEnv) {
    console.error(`Shiprocket auth failed: API Key mismatch. Expected ${apiKeyEnv}, got ${headerApiKey}`);
    return false;
  }

  // Shiprocket only sends HMAC signatures for POST webhooks, not for GET catalog fetches
  if (req.method !== 'GET') {
    // Clone request to read body text safely
    const clone = req.clone();
    const bodyText = await clone.text();

    const calculatedSignature = crypto
      .createHmac('sha256', apiSecretEnv)
      .update(bodyText)
      .digest('base64');

    if (calculatedSignature !== headerSignature) {
      console.error('Shiprocket auth failed: HMAC signature mismatch');
      return false;
    }
  }

  return true;
}
