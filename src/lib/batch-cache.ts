const CACHE_TTL = 5 * 60 * 1000;

interface CachedBatch {
  data: any;
  expires: number;
}

const batchCache = new Map<string, CachedBatch>();

export function getCachedBatch(batchCode: string): any | null {
  const cached = batchCache.get(batchCode.toUpperCase());
  if (cached && cached.expires > Date.now()) {
    return cached.data;
  }
  return null;
}

export function setCachedBatch(batchCode: string, data: any): void {
  batchCache.set(batchCode.toUpperCase(), {
    data,
    expires: Date.now() + CACHE_TTL,
  });
}

export function clearBatchCache(batchCode?: string): void {
  if (batchCode) {
    batchCache.delete(batchCode.toUpperCase());
  } else {
    batchCache.clear();
  }
}

export async function fetchBatchWithCache(batchCode: string): Promise<any | null> {
  const cached = getCachedBatch(batchCode);
  if (cached) return cached;

  try {
    const res = await fetch(`/api/batches/verify?code=${encodeURIComponent(batchCode)}`);
    const data = await res.json();
    if (data.ok && data.found && data.batch) {
      setCachedBatch(batchCode, data.batch);
      return data.batch;
    }
  } catch {
    // ignore
  }
  return null;
}