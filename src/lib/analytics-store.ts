import fs from "fs";
import path from "path";
import type { ScanRecord, AnalyticsSnapshot } from "./analytics-types";

interface StoreData {
  events: ScanRecord[];
}

const DATA_DIR =
  process.env.NODE_ENV === "production"
    ? path.join(process.cwd(), ".data")
    : path.join(process.cwd(), ".data");

const ANALYTICS_FILE = path.join(DATA_DIR, "analytics.json");

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readStore(): StoreData {
  try {
    ensureDir();
    if (fs.existsSync(ANALYTICS_FILE)) {
      const raw = fs.readFileSync(ANALYTICS_FILE, "utf-8");
      return JSON.parse(raw);
    }
  } catch {
    // corrupted file – reset
  }
  return { events: [] };
}

function writeStore(data: StoreData) {
  ensureDir();
  fs.writeFileSync(ANALYTICS_FILE, JSON.stringify(data), "utf-8");
}

export function addRecord(record: ScanRecord): void {
  const store = readStore();
  store.events.push(record);
  writeStore(store);
}

export function getAnalytics(): AnalyticsSnapshot {
  const store = readStore();
  const events = store.events;

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

  return {
    totalScans,
    productBreakdown,
    dailyScans,
    deviceBreakdown,
    browserBreakdown,
    osBreakdown,
    recentScans,
  };
}
