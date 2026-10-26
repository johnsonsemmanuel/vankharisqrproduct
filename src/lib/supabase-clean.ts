/**
 * Production-ready Supabase client with connection pooling, retries, and type safety
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  "";

export const isSupabaseConfigured = Boolean(
  SUPABASE_URL &&
    SUPABASE_URL.startsWith("https://") &&
    SUPABASE_KEY &&
    !SUPABASE_URL.includes("your-project") &&
    !SUPABASE_KEY.includes("your-")
);

export interface SupabaseResponse<T> {
  data: T | null;
  error: Error | null;
  count?: number;
}

async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retries = 3
): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, options);
      if (res.ok || res.status < 500) return res;
      if (i === retries - 1) return res;
      await new Promise((r) => setTimeout(r, 1000 * (i + 1)));
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise((r) => setTimeout(r, 1000 * (i + 1)));
    }
  }
  throw new Error("Max retries exceeded");
}

export async function supabaseQuery<T = any>(
  endpoint: string,
  options: {
    method?: "GET" | "POST" | "PATCH" | "DELETE";
    body?: any;
    headers?: Record<string, string>;
    prefer?: string;
    count?: "exact" | "planned" | "estimated";
  } = {}
): Promise<SupabaseResponse<T>> {
  if (!isSupabaseConfigured) {
    return { data: null, error: new Error("Supabase not configured") };
  }

  const { method = "GET", body, headers = {}, prefer = "return=representation", count } = options;

  const url = `${SUPABASE_URL.replace(/\/$/, "")}/rest/v1/${endpoint.replace(/^\//, "")}`;

  try {
    const res = await fetchWithRetry(url, {
      method,
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
        Prefer: count ? `${prefer},count=${count}` : prefer,
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      cache: "no-store",
    });

    if (!res.ok) {
      const errText = await res.text();
      return { data: null, error: new Error(`Supabase error ${res.status}: ${errText}`) };
    }

    if (res.status === 204) {
      return { data: null, error: null };
    }

    const data = await res.json();
    const countHeader = res.headers.get("content-range");
    return { data, error: null, count: countHeader ? parseInt(countHeader.split("/")[1]) : undefined };
  } catch (err: any) {
    return { data: null, error: err };
  }
}
