import fs from "fs";
import path from "path";
import { Redis } from "@upstash/redis";
import { isSupabaseConfigured, supabaseQuery } from "./supabase";
import crypto from "crypto";

const DATA_DIR = path.join(process.cwd(), ".data");
const SERIALS_FILE = path.join(DATA_DIR, "serials.json");

const redisUrl = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || "";
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN || "";

const kv = redisUrl && redisToken ? new Redis({ url: redisUrl, token: redisToken }) : null;
const KV_SERIALS = "kharis:serials";

export interface SerialRecord {
  id: string;
  serialCode: string;
  batchCode: string;
  productSlug: string;
  productName: string;
  used: boolean;
  usedAt?: number;
  usedByIpHash?: string;
  createdAt: number;
  scanCount: number;
}

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readStore(): SerialRecord[] {
  try {
    ensureDir();
    if (fs.existsSync(SERIALS_FILE)) {
      const raw = fs.readFileSync(SERIALS_FILE, "utf-8");
      const data = JSON.parse(raw);
      if (Array.isArray(data)) return data;
      if (Array.isArray(data.serials)) return data.serials;
    }
  } catch {}
  return [];
}

function writeStore(serials: SerialRecord[]) {
  try {
    ensureDir();
    fs.writeFileSync(SERIALS_FILE, JSON.stringify({ serials }, null, 2), "utf-8");
  } catch {}
}

export function generateSerialCode(): string {
  const bytes = crypto.randomBytes(8);
  return bytes.toString("hex").toUpperCase();
}

export async function createSerialsForBatch(
  batchCode: string,
  productSlug: string,
  productName: string,
  quantity: number
): Promise<SerialRecord[]> {
  const now = Date.now();
  const serials: SerialRecord[] = [];

  for (let i = 0; i < quantity; i++) {
    serials.push({
      id: `ser-${now}-${i}-${Math.random().toString(36).substring(2, 7)}`,
      serialCode: generateSerialCode(),
      batchCode: batchCode.toUpperCase(),
      productSlug,
      productName,
      used: false,
      createdAt: now,
      scanCount: 0,
    });
  }

  if (isSupabaseConfigured) {
    try {
      const rows = serials.map((s) => ({
        serial_code: s.serialCode,
        batch_code: s.batchCode,
        product_slug: s.productSlug,
        product_name: s.productName,
        used: false,
        scan_count: 0,
      }));
      await supabaseQuery("product_serials", {
        method: "POST",
        body: rows,
      });
    } catch (e) {
      console.error("Supabase createSerials error:", e);
    }
  }

  const all = await getAllSerials();
  all.push(...serials);
  if (kv) {
    try {
      await kv.set(KV_SERIALS, { serials: all });
    } catch {}
  }
  writeStore(all);
  return serials;
}

export async function getAllSerials(): Promise<SerialRecord[]> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabaseQuery<any[]>("product_serials?select=*&order=created_at.desc");
      if (!error && Array.isArray(data)) {
        return data.map((s) => ({
          id: s.id,
          serialCode: s.serial_code,
          batchCode: s.batch_code,
          productSlug: s.product_slug,
          productName: s.product_name,
          used: s.used,
          usedAt: s.used_at ? new Date(s.used_at).getTime() : undefined,
          usedByIpHash: s.used_by_ip_hash || undefined,
          createdAt: new Date(s.created_at).getTime(),
          scanCount: Number(s.scan_count) || 0,
        }));
      }
    } catch (e) {
      console.error("Supabase getAllSerials error:", e);
    }
  }

  if (kv) {
    try {
      const raw = await kv.get<SerialRecord[] | { serials: SerialRecord[] }>(KV_SERIALS);
      if (raw) {
        if (Array.isArray(raw)) return raw;
        if (Array.isArray((raw as any).serials)) return (raw as any).serials;
      }
    } catch {}
  }

  return readStore();
}

export async function verifyAndUseSerial(
  serialCode: string,
  ipHash?: string
): Promise<{ valid: boolean; reason?: string; serial?: SerialRecord }> {
  const code = serialCode.trim().toUpperCase();
  const all = await getAllSerials();
  const serial = all.find((s) => s.serialCode === code);

  if (!serial) {
    return { valid: false, reason: "invalid" };
  }

  if (serial.used) {
    return { valid: false, reason: "already_used", serial };
  }

  serial.used = true;
  serial.usedAt = Date.now();
  serial.usedByIpHash = ipHash;
  serial.scanCount += 1;

  if (isSupabaseConfigured) {
    try {
      await supabaseQuery(`product_serials?serial_code=eq.${encodeURIComponent(code)}`, {
        method: "PATCH",
        body: {
          used: true,
          used_at: new Date().toISOString(),
          used_by_ip_hash: ipHash || null,
          scan_count: serial.scanCount,
        },
      });
    } catch (e) {
      console.error("Supabase useSerial error:", e);
    }
  }

  const idx = all.findIndex((s) => s.serialCode === code);
  if (idx >= 0) all[idx] = serial;

  if (kv) {
    try {
      await kv.set(KV_SERIALS, { serials: all });
    } catch {}
  }
  writeStore(all);

  return { valid: true, serial };
}

export async function getSerialsByBatch(batchCode: string): Promise<SerialRecord[]> {
  const all = await getAllSerials();
  return all.filter((s) => s.batchCode === batchCode.toUpperCase());
}
