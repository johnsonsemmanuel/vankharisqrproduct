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

export function logout(): void {
  localStorage.removeItem(STORAGE_KEY);
}
