import fs from "fs";
import path from "path";
import { Redis } from "@upstash/redis";

const DATA_DIR = path.join(process.cwd(), ".data");
const BATCHES_FILE = path.join(DATA_DIR, "batches.json");

const redisUrl = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || "";
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN || "";

const kv = redisUrl && redisToken ? new Redis({ url: redisUrl, token: redisToken }) : null;
const KV_BATCHES = "kharis:batches";

export interface BatchRecord {
  id: string;
  batchCode: string;
  productSlug: string;
  productName: string;
  printQuantity: number;
  qrColor: string;
  qrColorName: string;
  packagingMaterial: string;
  createdAt: number;
  productionDate: string;
  expiryDate?: string;
  facility?: string;
  notes?: string;
  scanCount: number;
  lastScannedAt?: number;
  status: "active" | "depleted" | "recalled";
}

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readStore(): BatchRecord[] {
  try {
    ensureDir();
    if (fs.existsSync(BATCHES_FILE)) {
      const raw = fs.readFileSync(BATCHES_FILE, "utf-8");
      const data = JSON.parse(raw);
      if (Array.isArray(data)) return data;
      if (Array.isArray(data.batches)) return data.batches;
    }
  } catch {
    // fallback
  }
  return [];
}

function writeStore(batches: BatchRecord[]) {
  try {
    ensureDir();
    fs.writeFileSync(BATCHES_FILE, JSON.stringify({ batches }, null, 2), "utf-8");
  } catch {
    // fallback
  }
}

export async function getAllBatches(): Promise<BatchRecord[]> {
  try {
    if (kv) {
      const raw = await kv.get<BatchRecord[] | { batches: BatchRecord[] }>(KV_BATCHES);
      if (raw) {
        if (Array.isArray(raw)) return raw;
        if (Array.isArray((raw as any).batches)) return (raw as any).batches;
      }
    }
  } catch (e) {
    console.error("Redis error fetching batches:", e);
  }
  return readStore();
}

export async function getBatchByCode(batchCode: string): Promise<BatchRecord | null> {
  const normalized = batchCode.trim().toUpperCase();
  const all = await getAllBatches();
  return all.find((b) => b.batchCode.toUpperCase() === normalized) || null;
}

export async function createBatch(
  data: Omit<BatchRecord, "id" | "createdAt" | "scanCount" | "status">
): Promise<BatchRecord> {
  const all = await getAllBatches();
  const normalizedCode = data.batchCode.trim().toUpperCase();

  // Check if batch code already exists, update quantity/details if re-registering
  const existingIndex = all.findIndex(
    (b) => b.batchCode.toUpperCase() === normalizedCode
  );

  const now = Date.now();

  if (existingIndex >= 0) {
    const updated: BatchRecord = {
      ...all[existingIndex],
      ...data,
      batchCode: normalizedCode,
      printQuantity: Number(data.printQuantity) || 1,
    };
    all[existingIndex] = updated;

    if (kv) {
      try {
        await kv.set(KV_BATCHES, { batches: all });
      } catch (e) {
        console.error("Redis save batch error:", e);
      }
    }
    writeStore(all);
    return updated;
  }

  const newRecord: BatchRecord = {
    ...data,
    id: `batch-${now}-${Math.random().toString(36).substring(2, 7)}`,
    batchCode: normalizedCode,
    printQuantity: Math.max(1, Number(data.printQuantity) || 1),
    createdAt: now,
    scanCount: 0,
    status: "active",
  };

  all.unshift(newRecord);

  if (kv) {
    try {
      await kv.set(KV_BATCHES, { batches: all });
    } catch (e) {
      console.error("Redis save batch error:", e);
    }
  }
  writeStore(all);

  return newRecord;
}

export async function recordBatchScan(batchCode: string): Promise<BatchRecord | null> {
  if (!batchCode) return null;
  const normalized = batchCode.trim().toUpperCase();
  const all = await getAllBatches();
  const index = all.findIndex((b) => b.batchCode.toUpperCase() === normalized);

  if (index === -1) return null;

  all[index].scanCount = (all[index].scanCount || 0) + 1;
  all[index].lastScannedAt = Date.now();

  if (kv) {
    try {
      await kv.set(KV_BATCHES, { batches: all });
    } catch (e) {
      console.error("Redis recordBatchScan error:", e);
    }
  }
  writeStore(all);

  return all[index];
}
