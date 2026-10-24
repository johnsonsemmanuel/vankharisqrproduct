const ADMIN_PASSWORD = "Kharis2026";
const STORAGE_KEY = "kharis_admin_auth";

export function checkAuth(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(STORAGE_KEY) === "true";
}

export function login(password: string): boolean {
  if (password === ADMIN_PASSWORD) {
    localStorage.setItem(STORAGE_KEY, "true");
    return true;
  }
  return false;
}

export async function loginWithSupabase(email: string, password: string): Promise<{ success: boolean; error?: string }> {
  if (typeof window === "undefined") return { success: false, error: "Server only" };
  const { createClient } = await import("@/lib/supabase/client");
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return { success: false, error: error.message };
  }
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Authentication failed" };
  const { data: admin } = await supabase
    .from('admin_users')
    .select('id')
    .eq('id', user.id)
    .single();
  if (!admin) {
    await supabase.auth.signOut();
    return { success: false, error: "Not authorized for admin console" };
  }
  localStorage.setItem(STORAGE_KEY, "true");
  return { success: true };
}

export function logout(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export function createAdminClient() {
  return import("@/lib/supabase/admin").then(({ createClient }) => createClient());
}