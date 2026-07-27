import { verify } from "https://deno.land/x/djwt@v2.8/mod.ts";

export async function getJwtKey(): Promise<CryptoKey> {
  // Signing key is a dedicated secret, never the admin password itself.
  const secret = Deno.env.get('ADMIN_JWT_SECRET') ?? Deno.env.get('ADMIN_PASSWORD')!;
  const encoder = new TextEncoder();
  // Derive a full-entropy 256-bit key instead of padding/truncating the raw string.
  const digest = await crypto.subtle.digest('SHA-256', encoder.encode(secret));

  return await crypto.subtle.importKey(
    "raw",
    digest,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export async function verifyAdminToken(authHeader: string | null): Promise<{ valid: boolean; error?: string }> {
  if (!authHeader?.startsWith('Bearer ')) {
    return { valid: false, error: 'Missing or invalid authorization header' };
  }
  
  const token = authHeader.replace('Bearer ', '');
  
  try {
    const key = await getJwtKey();
    const payload = await verify(token, key);
    
    if (payload.role !== 'admin') {
      return { valid: false, error: 'Invalid role' };
    }
    
    return { valid: true };
  } catch (error) {
    console.error('Token verification failed:', error);
    return { valid: false, error: 'Invalid or expired token' };
  }
}
