import fs from "fs";
import path from "path";
import { Redis } from "@upstash/redis";
import type { ScanRecord, FeedbackRecord, AnalyticsSnapshot } from "./analytics-types";

const DATA_DIR = path.join(process.cwd(), ".data");
const ANALYTICS_FILE = path.join(DATA_DIR, "analytics.json");

const redisUrl = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || "";
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN || "";

const kv = redisUrl && redisToken ? new Redis({ url: redisUrl, token: redisToken }) : null;

const KV_EVENTS = "analytics:events";
const KV_FEEDBACK = "analytics:feedback";

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readStore(): { events: ScanRecord[]; feedback: FeedbackRecord[] } {
  try {
    ensureDir();
    if (fs.existsSync(ANALYTICS_FILE)) {
      const raw = fs.readFileSync(ANALYTICS_FILE, "utf-8");
      const data = JSON.parse(raw);
      return {
        events: data.events || [],
        feedback: data.feedback || [],
      };
    }
  } catch {
    // corrupted file – reset
  }
  return { events: [], feedback: [] };
}

function writeStore(data: { events: ScanRecord[]; feedback: FeedbackRecord[] }) {
  try {
    ensureDir();
    fs.writeFileSync(ANALYTICS_FILE, JSON.stringify(data), "utf-8");
  } catch {
    // write failed (e.g. readonly fs on serverless)
  }
}

async function redisLength(key: string): Promise<number> {
  if (!kv) return 0;
  try {
    return await kv.llen(key);
  } catch {
    return 0;
  }
}

async function redisPush(key: string, value: string): Promise<void> {
  if (!kv) return;
  await kv.lpush(key, value);
}

async function redisRange(key: string): Promise<string[]> {
  if (!kv) return [];
  try {
    const result = await kv.lrange(key, 0, -1);
    return Array.isArray(result) ? result : [];
  } catch (e) {
    console.error(`Redis LRANGE error on ${key}:`, e);
    return [];
  }
}

export async function addRecord(record: ScanRecord): Promise<void> {
  try {
    if (kv) {
      await redisPush(KV_EVENTS, JSON.stringify(record));
      return;
    }
    const store = readStore();
    store.events.push(record);
    writeStore(store);
  } catch (e) {
    console.error("addRecord error:", e);
  }
}

export async function addFeedback(record: FeedbackRecord): Promise<void> {
  try {
    if (kv) {
      await redisPush(KV_FEEDBACK, JSON.stringify(record));
      return;
    }
    const store = readStore();
    store.feedback.push(record);
    writeStore(store);
  } catch (e) {
    console.error("addFeedback error:", e);
  }
}

export async function getAnalytics(): Promise<AnalyticsSnapshot> {
  let events: ScanRecord[] = [];
  let feedback: FeedbackRecord[] = [];

  try {
    if (kv) {
      const [rawEvents, rawFeedback] = await Promise.all([
        redisRange(KV_EVENTS),
        redisRange(KV_FEEDBACK),
      ]);
      events = rawEvents.map((s) => {
        try { return JSON.parse(s); } catch { return null; }
      }).filter(Boolean) as ScanRecord[];
      feedback = rawFeedback.map((s) => {
        try { return JSON.parse(s); } catch { return null; }
      }).filter(Boolean) as FeedbackRecord[];
    } else {
      const store = readStore();
      events = store.events;
      feedback = store.feedback;
    }
  } catch (e) {
    console.error("getAnalytics error:", e);
  }

  const totalScans = events.length;

  const productCount: Record<string, { name: string; count: number }> = {};
  const dailyCount: Record<string, number> = {};
  const deviceCount: Record<string, number> = {};
  const browserCount: Record<string, number> = {};
  const osCount: Record<string, number> = {};

  for (const e of events) {
    if (!productCount[e.productSlug]) {
      productCount[e.productSlug] = { name: e.productName, count: 0 };
    }
    productCount[e.productSlug].count++;

    dailyCount[e.date] = (dailyCount[e.date] || 0) + 1;
    deviceCount[e.deviceType] = (deviceCount[e.deviceType] || 0) + 1;
    browserCount[e.browser] = (browserCount[e.browser] || 0) + 1;
    osCount[e.os] = (osCount[e.os] || 0) + 1;
  }

  const productBreakdown = Object.entries(productCount)
    .map(([slug, v]) => ({ slug, name: v.name, count: v.count }))
    .sort((a, b) => b.count - a.count);

  const dailyScans = Object.entries(dailyCount)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const deviceBreakdown = Object.entries(deviceCount)
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count);

  const browserBreakdown = Object.entries(browserCount)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  const osBreakdown = Object.entries(osCount)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  const recentScans = [...events].reverse().slice(0, 50);

  const totalFeedback = feedback.length;
  const averageRating =
    totalFeedback > 0
      ? Number(
          (
            feedback.reduce((sum, f) => sum + f.rating, 0) / totalFeedback
          ).toFixed(1)
        )
      : 0;

  const productFeedbackData: Record<
    string,
    { name: string; sumRating: number; count: number }
  > = {};

  for (const f of feedback) {
    if (!productFeedbackData[f.productSlug]) {
      productFeedbackData[f.productSlug] = {
        name: f.productName,
        sumRating: 0,
        count: 0,
      };
    }
    productFeedbackData[f.productSlug].sumRating += f.rating;
    productFeedbackData[f.productSlug].count++;
  }

  const productFeedbackBreakdown = Object.entries(productFeedbackData).map(
    ([slug, v]) => ({
      slug,
      name: v.name,
      avgRating: Number((v.sumRating / v.count).toFixed(1)),
      count: v.count,
    })
  );

  const recentFeedback = [...feedback].reverse().slice(0, 50);

  return {
    totalScans,
    productBreakdown,
    dailyScans,
    deviceBreakdown,
    browserBreakdown,
    osBreakdown,
    recentScans,
    totalFeedback,
    averageRating,
    productFeedbackBreakdown,
    recentFeedback,
  };
}

export async function exportAllData(): Promise<{
  events: ScanRecord[];
  feedback: FeedbackRecord[];
  generatedAt: string;
}> {
  let events: ScanRecord[] = [];
  let feedback: FeedbackRecord[] = [];

  try {
    if (kv) {
      const [rawEvents, rawFeedback] = await Promise.all([
        redisRange(KV_EVENTS),
        redisRange(KV_FEEDBACK),
      ]);
      events = rawEvents.map((s) => {
        try { return JSON.parse(s); } catch { return null; }
      }).filter(Boolean) as ScanRecord[];
      feedback = rawFeedback.map((s) => {
        try { return JSON.parse(s); } catch { return null; }
      }).filter(Boolean) as FeedbackRecord[];
    } else {
      const store = readStore();
      events = store.events;
      feedback = store.feedback;
    }
  } catch (e) {
    console.error("exportAllData error:", e);
  }

  return {
    events,
    feedback,
    generatedAt: new Date().toISOString(),
  };
}

export async function getStorageInfo(): Promise<{
  type: "redis" | "filesystem" | "none";
  events: number;
  feedback: number;
}> {
  if (kv) {
    const [eventCount, feedbackCount] = await Promise.all([
      redisLength(KV_EVENTS),
      redisLength(KV_FEEDBACK),
    ]);
    return { type: "redis", events: eventCount, feedback: feedbackCount };
  }
  if (process.env.VERCEL) {
    return { type: "none", events: 0, feedback: 0 };
  }
  const store = readStore();
  return { type: "filesystem", events: store.events.length, feedback: store.feedback.length };
}
