import { verify } from "https://deno.land/x/djwt@v2.8/mod.ts";

export async function getJwtKey(): Promise<CryptoKey> {
  const secret = Deno.env.get('ADMIN_PASSWORD')!;
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret.padEnd(32, '0').slice(0, 32));
  
  return await crypto.subtle.importKey(
    "raw",
    keyData,
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
