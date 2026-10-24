/**
 * Lightweight, zero-dependency REST client for Supabase PostgreSQL.
 *
 * Why PostgREST REST client?
 * - Zero external dependencies (no need for heavyweight npm modules that slow down builds)
 * - Standard fetch-compatible (works seamlessly on Node.js, Vercel Serverless, Next.js Edge, and browser)
 * - Fully typed queries with fallback safety to ensure zero crashes if credentials are not yet configured.
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
    !SUPABASE_URL.includes("your-project")
);

export async function supabaseQuery<T = any>(
  endpoint: string,
  options: {
    method?: "GET" | "POST" | "PATCH" | "DELETE";
    body?: any;
    headers?: Record<string, string>;
    prefer?: string;
  } = {}
): Promise<{ data: T | null; error: any }> {
  if (!isSupabaseConfigured) {
    return { data: null, error: new Error("Supabase is not configured yet") };
  }

  const { method = "GET", body, headers = {}, prefer = "return=representation" } = options;

  const url = `${SUPABASE_URL.replace(/\/$/, "")}/rest/v1/${endpoint.replace(/^\//, "")}`;

  try {
    const res = await fetch(url, {
      method,
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
        Prefer: prefer,
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      cache: "no-store",
    });

    if (!res.ok) {
      const errText = await res.text();
      return { data: null, error: new Error(`Supabase query error (${res.status}): ${errText}`) };
    }

    if (res.status === 204) {
      return { data: null, error: null };
    }

    const data = await res.json();
    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err };
  }
}
