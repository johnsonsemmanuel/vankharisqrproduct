export interface ScanRecord {
  id: string;
  productSlug: string;
  productName: string;
  timestamp: number;
  date: string;
  deviceType: string;
  browser: string;
  os: string;
  referrer: string;
}

export interface AnalyticsSnapshot {
  totalScans: number;
  productBreakdown: { slug: string; name: string; count: number }[];
  dailyScans: { date: string; count: number }[];
  deviceBreakdown: { type: string; count: number }[];
  browserBreakdown: { name: string; count: number }[];
  osBreakdown: { name: string; count: number }[];
  recentScans: ScanRecord[];
}
