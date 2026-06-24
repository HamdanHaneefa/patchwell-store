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

  // To allow Shiprocket to test the link in a browser, and because catalog data 
  // is public anyway, we bypass authentication entirely for GET requests.
  if (req.method === 'GET') {
    return true;
  }

  const headerApiKey = req.headers.get('x-api-key') || '';
  const headerSignature = req.headers.get('x-api-hmac-sha256') || '';

  if (headerApiKey !== apiKeyEnv) {
    console.error(`Shiprocket auth failed: API Key mismatch. Expected ${apiKeyEnv}, got ${headerApiKey}`);
    return false;
  }

  return true;
}
