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

export interface FeedbackRecord {
  id: string;
  productSlug: string;
  productName: string;
  rating: number;
  comment?: string;
  timestamp: number;
  date: string;
}

export interface AnalyticsSnapshot {
  totalScans: number;
  productBreakdown: { slug: string; name: string; count: number }[];
  dailyScans: { date: string; count: number }[];
  deviceBreakdown: { type: string; count: number }[];
  browserBreakdown: { name: string; count: number }[];
  osBreakdown: { name: string; count: number }[];
  recentScans: ScanRecord[];
  totalFeedback: number;
  averageRating: number;
  productFeedbackBreakdown: { slug: string; name: string; avgRating: number; count: number }[];
  recentFeedback: FeedbackRecord[];
}
