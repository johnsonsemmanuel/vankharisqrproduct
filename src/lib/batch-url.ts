import { createHmac } from "crypto";

const SIGNING_KEY = process.env.BATCH_URL_SECRET || "dev-secret-change-me-in-production";

export function signBatchUrl(slug: string, batchCode: string): string {
  const timestamp = Date.now();
  const payload = `${slug}|${batchCode}|${timestamp}`;
  const sig = createHmac("sha256", SIGNING_KEY).update(payload).digest("hex").slice(0, 16);
  return `/product/${slug}?batch=${encodeURIComponent(batchCode)}&ts=${timestamp}&sig=${sig}`;
}

export function verifyBatchUrl(slug: string, batchCode: string, timestamp: string | null, sig: string | null): { valid: boolean; expired?: boolean; tampered?: boolean } {
  if (!timestamp || !sig) {
    return { valid: true };
  }

  const payload = `${slug}|${batchCode}|${timestamp}`;
  const expectedSig = createHmac("sha256", SIGNING_KEY).update(payload).digest("hex").slice(0, 16);
  
  if (sig !== expectedSig) {
    return { valid: false, tampered: true };
  }

  const age = Date.now() - parseInt(timestamp, 10);
  const twoYears = 2 * 365 * 24 * 60 * 60 * 1000;
  
  if (age >= twoYears) {
    return { valid: false, expired: true };
  }

  return { valid: true };
}

export function generateQrDataUrl(slug: string, batchCode: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://kharisfoods.vankharis.com";
  const signedPath = signBatchUrl(slug, batchCode);
  return `${baseUrl}${signedPath}`;
}