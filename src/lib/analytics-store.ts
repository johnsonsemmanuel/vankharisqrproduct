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
  if (kv) return { events: [], feedback: [] };
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
  if (kv) return;
  ensureDir();
  fs.writeFileSync(ANALYTICS_FILE, JSON.stringify(data), "utf-8");
}

export async function addRecord(record: ScanRecord): Promise<void> {
  if (kv) {
    await kv.lpush(KV_EVENTS, JSON.stringify(record));
    return;
  }
  const store = readStore();
  store.events.push(record);
  writeStore(store);
}

export async function addFeedback(record: FeedbackRecord): Promise<void> {
  if (kv) {
    await kv.lpush(KV_FEEDBACK, JSON.stringify(record));
    return;
  }
  const store = readStore();
  store.feedback.push(record);
  writeStore(store);
}

export async function getAnalytics(): Promise<AnalyticsSnapshot> {
  let events: ScanRecord[] = [];
  let feedback: FeedbackRecord[] = [];

  if (kv) {
    const [rawEvents, rawFeedback] = await Promise.all([
      kv.lrange(KV_EVENTS, 0, -1) as Promise<string[]>,
      kv.lrange(KV_FEEDBACK, 0, -1) as Promise<string[]>,
    ]);
    events = (rawEvents || []).map((s) => JSON.parse(s)).reverse();
    feedback = (rawFeedback || []).map((s) => JSON.parse(s)).reverse();
  } else {
    const store = readStore();
    events = store.events;
    feedback = store.feedback;
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

  if (kv) {
    const [rawEvents, rawFeedback] = await Promise.all([
      kv.lrange(KV_EVENTS, 0, -1) as Promise<string[]>,
      kv.lrange(KV_FEEDBACK, 0, -1) as Promise<string[]>,
    ]);
    events = (rawEvents || []).map((s) => JSON.parse(s)).reverse();
    feedback = (rawFeedback || []).map((s) => JSON.parse(s)).reverse();
  } else {
    const store = readStore();
    events = store.events;
    feedback = store.feedback;
  }

  return {
    events,
    feedback,
    generatedAt: new Date().toISOString(),
  };
}
