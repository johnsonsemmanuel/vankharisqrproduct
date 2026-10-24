import fs from "fs";
import path from "path";
import { Redis } from "@upstash/redis";
import { isSupabaseConfigured, supabaseQuery } from "./supabase";

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
  // 1. Try Supabase first if configured
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabaseQuery<any[]>("batches?select=*&order=created_at.desc");
      if (!error && Array.isArray(data)) {
        return data.map((b) => ({
          id: b.id,
          batchCode: b.batch_code,
          productSlug: b.product_slug,
          productName: b.product_name,
          printQuantity: Number(b.print_quantity) || 1000,
          qrColor: b.qr_color || "#000000",
          qrColorName: b.qr_color_name || "Standard Black",
          packagingMaterial: b.packaging_material || "Standard",
          createdAt: new Date(b.created_at).getTime(),
          productionDate: b.production_date,
          expiryDate: b.expiry_date || undefined,
          facility: b.facility || undefined,
          notes: b.notes || undefined,
          scanCount: Number(b.scan_count) || 0,
          lastScannedAt: b.last_scanned_at ? new Date(b.last_scanned_at).getTime() : undefined,
          status: b.status || "active",
        }));
      }
    } catch (e) {
      console.error("Supabase getAllBatches error:", e);
    }
  }

  // 2. Secondary fallback: Upstash Redis
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

  // 3. Fallback: local file
  return readStore();
}

export async function getBatchByCode(batchCode: string): Promise<BatchRecord | null> {
  const normalized = batchCode.trim().toUpperCase();

  // Try Supabase direct query
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabaseQuery<any[]>(
        `batches?batch_code=eq.${encodeURIComponent(normalized)}&select=*`
      );
      if (!error && Array.isArray(data) && data.length > 0) {
        const b = data[0];
        return {
          id: b.id,
          batchCode: b.batch_code,
          productSlug: b.product_slug,
          productName: b.product_name,
          printQuantity: Number(b.print_quantity) || 1000,
          qrColor: b.qr_color || "#000000",
          qrColorName: b.qr_color_name || "Standard Black",
          packagingMaterial: b.packaging_material || "Standard",
          createdAt: new Date(b.created_at).getTime(),
          productionDate: b.production_date,
          expiryDate: b.expiry_date || undefined,
          facility: b.facility || undefined,
          notes: b.notes || undefined,
          scanCount: Number(b.scan_count) || 0,
          lastScannedAt: b.last_scanned_at ? new Date(b.last_scanned_at).getTime() : undefined,
          status: b.status || "active",
        };
      }
    } catch (e) {
      console.error("Supabase getBatchByCode error:", e);
    }
  }

  const all = await getAllBatches();
  return all.find((b) => b.batchCode.toUpperCase() === normalized) || null;
}

export async function createBatch(
  data: Omit<BatchRecord, "id" | "createdAt" | "scanCount" | "status">
): Promise<BatchRecord> {
  const normalizedCode = data.batchCode.trim().toUpperCase();
  const now = Date.now();

  const newRecord: BatchRecord = {
    ...data,
    id: `batch-${now}-${Math.random().toString(36).substring(2, 7)}`,
    batchCode: normalizedCode,
    printQuantity: Math.max(1, Number(data.printQuantity) || 1),
    createdAt: now,
    scanCount: 0,
    status: "active",
  };

  // 1. Sync to Supabase if configured
  if (isSupabaseConfigured) {
    try {
      await supabaseQuery("batches", {
        method: "POST",
        body: {
          batch_code: normalizedCode,
          product_slug: data.productSlug,
          product_name: data.productName,
          print_quantity: newRecord.printQuantity,
          packaging_material: data.packagingMaterial,
          qr_color: data.qrColor,
          qr_color_name: data.qrColorName,
          production_date: data.productionDate,
          expiry_date: data.expiryDate || null,
          facility: data.facility || "Main Plant",
          notes: data.notes || null,
          status: "active",
        },
      });
    } catch (e) {
      console.error("Supabase createBatch error:", e);
    }
  }

  // 2. Local fallback sync
  const all = await getAllBatches();
  const existingIndex = all.findIndex((b) => b.batchCode.toUpperCase() === normalizedCode);

  if (existingIndex >= 0) {
    all[existingIndex] = { ...all[existingIndex], ...newRecord };
  } else {
    all.unshift(newRecord);
  }

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

export async function updateBatch(
  batchIdOrCode: string,
  updates: Partial<BatchRecord>
): Promise<BatchRecord | null> {
  const all = await getAllBatches();
  const normalized = batchIdOrCode.trim().toUpperCase();

  const index = all.findIndex(
    (b) => b.id === batchIdOrCode || b.batchCode.toUpperCase() === normalized
  );

  if (index === -1) return null;

  const current = all[index];
  const updated: BatchRecord = {
    ...current,
    ...updates,
    printQuantity: updates.printQuantity ? Math.max(1, Number(updates.printQuantity)) : current.printQuantity,
  };

  all[index] = updated;

  // Sync to Supabase
  if (isSupabaseConfigured) {
    try {
      await supabaseQuery(`batches?batch_code=eq.${encodeURIComponent(current.batchCode)}`, {
        method: "PATCH",
        body: {
          packaging_material: updated.packagingMaterial,
          print_quantity: updated.printQuantity,
          status: updated.status,
          notes: updated.notes || null,
        },
      });
    } catch (e) {
      console.error("Supabase updateBatch error:", e);
    }
  }

  if (kv) {
    try {
      await kv.set(KV_BATCHES, { batches: all });
    } catch (e) {
      console.error("Redis updateBatch error:", e);
    }
  }
  writeStore(all);

  return updated;
}

export async function deleteBatch(batchIdOrCode: string): Promise<boolean> {
  let all = await getAllBatches();
  const normalized = batchIdOrCode.trim().toUpperCase();

  const target = all.find(
    (b) => b.id === batchIdOrCode || b.batchCode.toUpperCase() === normalized
  );

  if (!target) return false;

  all = all.filter((b) => b.id !== target.id && b.batchCode.toUpperCase() !== normalized);

  // Delete from Supabase
  if (isSupabaseConfigured) {
    try {
      await supabaseQuery(`batches?batch_code=eq.${encodeURIComponent(target.batchCode)}`, {
        method: "DELETE",
      });
    } catch (e) {
      console.error("Supabase deleteBatch error:", e);
    }
  }

  if (kv) {
    try {
      await kv.set(KV_BATCHES, { batches: all });
    } catch (e) {
      console.error("Redis deleteBatch error:", e);
    }
  }
  writeStore(all);

  return true;
}

export async function recordBatchScan(batchCode: string): Promise<BatchRecord | null> {
  if (!batchCode) return null;
  const normalized = batchCode.trim().toUpperCase();

  // 1. Sync scan increment in Supabase
  if (isSupabaseConfigured) {
    try {
      const existing = await getBatchByCode(normalized);
      if (existing) {
        const newCount = (existing.scanCount || 0) + 1;
        await supabaseQuery(`batches?batch_code=eq.${encodeURIComponent(normalized)}`, {
          method: "PATCH",
          body: {
            scan_count: newCount,
            last_scanned_at: new Date().toISOString(),
          },
        });
      }
    } catch (e) {
      console.error("Supabase recordBatchScan error:", e);
    }
  }

  // 2. Local/Redis update
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
