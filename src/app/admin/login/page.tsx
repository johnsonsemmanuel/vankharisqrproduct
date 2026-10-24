"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { checkAuth, login } from "@/lib/admin-auth";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (checkAuth()) router.replace("/admin");
  }, [router]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    if (login(password)) {
      const redirect = new URLSearchParams(window.location.search).get("redirect");
      router.replace(redirect && redirect.startsWith("/admin") ? redirect : "/admin");
    } else {
      setError("Incorrect password. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-dvh items-center justify-center bg-neutral-50 px-4 py-12 dark:bg-neutral-950">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <img
            src="/images/kharisfoods-removebg-preview.png"
            alt="Kharis Foods"
            className="h-14 w-auto"
          />
          <h1 className="mt-4 text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            Operations Console
          </h1>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Sign in to manage packaging codes and insights.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
        >
          <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            <ShieldCheck className="h-4 w-4 text-brand-600 dark:text-brand-400" />
            Admin access
          </div>

          <label
            htmlFor="admin-password"
            className="mb-1.5 block text-xs font-semibold text-neutral-700 dark:text-neutral-300"
          >
            Admin password
          </label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              id="admin-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
              autoFocus
              placeholder="Enter password"
              className="w-full rounded-lg border border-neutral-300 bg-white py-2.5 pl-9 pr-10 text-sm text-neutral-900 placeholder-neutral-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100"
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          {error && (
            <div className="mt-3 flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300">
              <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || !password}
            className="mt-5 w-full rounded-lg bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:opacity-50 dark:bg-brand-600 dark:hover:bg-brand-500"
          >
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-[11px] text-neutral-400 dark:text-neutral-500">
          Kharis Foods · Internal operations tool
        </p>
      </div>
    </div>
  );
}
