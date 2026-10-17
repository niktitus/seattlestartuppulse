// Stateless, third-party-free anti-spam: HMAC-signed challenge + SHA-256 proof of work + minimum fill time.
export const POW_DIFFICULTY = 16; // leading zero bits
export const MIN_AGE_MS = 3000;
export const MAX_AGE_MS = 30 * 60 * 1000;
const enc = new TextEncoder();
const hex = (b: ArrayBuffer) => [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join('');

async function hmac(secret: string, data: string) {
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return hex(await crypto.subtle.sign('HMAC', key, enc.encode(data)));
}

export function leadingZeroBits(bytes: Uint8Array) {
  let n = 0;
  for (const b of bytes) { if (b === 0) { n += 8; continue; } return n + Math.clz32(b) - 24; }
  return n;
}

export async function issueChallenge(secret: string, now = Date.now()) {
  const nonce = hex(crypto.getRandomValues(new Uint8Array(12)).buffer);
  const body = `${now}.${nonce}`;
  return `${body}.${await hmac(secret, `void-pow:${body}`)}`;
}

export async function verifyProof(secret: string, token: string, now = Date.now(), difficulty = POW_DIFFICULTY) {
  const [challenge, solution] = token.split('|');
  if (!challenge || !solution || !/^\d{1,12}$/.test(solution)) return 'invalid';
  const [ts, nonce, sig] = challenge.split('.');
  if (!ts || !nonce || !sig || sig !== await hmac(secret, `void-pow:${ts}.${nonce}`)) return 'invalid';
  const age = now - Number(ts);
  if (age < MIN_AGE_MS) return 'too_fast';
  if (age > MAX_AGE_MS) return 'expired';
  const digest = new Uint8Array(await crypto.subtle.digest('SHA-256', enc.encode(`${challenge}:${solution}`)));
  return leadingZeroBits(digest) >= difficulty ? 'ok' : 'invalid';
}
