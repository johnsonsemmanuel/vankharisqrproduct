"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { QrCode, BarChart3, ShieldAlert, LogIn, LogOut, ChevronRight, Eye, EyeOff } from "lucide-react";
import { checkAuth, login, logout } from "@/lib/admin-auth";
import { Button } from "@/components/ui/button";

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setAuthenticated(checkAuth());
    setLoading(false);
  }, []);

  const handleLogin = () => {
    if (login(password)) {
      setAuthenticated(true);
      setError(false);
      setPassword("");
    } else {
      setError(true);
    }
  };

  if (loading) return null;

  if (!authenticated) {
    return (
      <div className="min-h-dvh bg-gray-50 dark:bg-neutral-950 flex items-center justify-center p-5">
        <div className="w-full max-w-sm">
          <div className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 p-6 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-kharis-green-100 flex items-center justify-center mb-4">
              <ShieldAlert className="w-6 h-6 text-kharis-green-700" />
            </div>
            <h1 className="text-lg font-bold text-gray-800 dark:text-neutral-100 mb-1">Admin Access</h1>
            <p className="text-sm text-gray-500 dark:text-neutral-300 mb-6">
              Enter password to access the admin dashboard.
            </p>

            <form
              onSubmit={(e) => { e.preventDefault(); handleLogin(); }}
              className="space-y-4"
            >
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(false); }}
                  placeholder="Password"
                  className="w-full px-4 py-2.5 pr-10 rounded-xl border border-gray-200 dark:border-neutral-800 text-sm
                    focus:outline-none focus:ring-2 focus:ring-kharis-green-500/30 focus:border-kharis-green-500
                    placeholder:text-gray-400 dark:text-neutral-400"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 dark:text-neutral-300 hover:text-gray-900 dark:hover:text-neutral-100 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {error && (
                <p className="text-xs text-red-500 text-center">Incorrect password.</p>
              )}
              <Button type="submit" className="w-full">
                <LogIn className="w-4 h-4" />
                Sign In
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-gray-50 dark:bg-neutral-950">
      <header className="sticky top-0 z-40 bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-800">
        <div className="flex items-center justify-between px-5 h-14 max-w-lg mx-auto">
          <div className="flex items-center gap-2">
            <img
              src="/images/kharisfoods-removebg-preview.png"
              alt="Kharis Foods"
              className="h-6 w-auto"
            />
            <h1 className="font-bold text-gray-800 dark:text-neutral-100 text-sm">Admin</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => { logout(); setAuthenticated(false); }}
              variant="ghost"
              size="sm"
              className="text-gray-400 dark:text-neutral-400 hover:text-red-500"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-5 py-12">
        <div className="text-center mb-8">
          <h2 className="text-lg font-bold text-gray-800 dark:text-neutral-100">Dashboard</h2>
          <p className="text-sm text-gray-500 dark:text-neutral-300 mt-1">Manage QR codes and view scan analytics.</p>
        </div>

        <div className="space-y-4">
          <Link
            href="/admin/qr"
            className="group flex items-center gap-4 p-5 bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800
              hover:border-kharis-green-300 dark:hover:border-kharis-green-600 hover:shadow-md hover:-translate-y-0.5
              active:translate-y-0 active:shadow-sm
              transition-all duration-200 text-left"
          >
            <div className="w-12 h-12 rounded-xl bg-kharis-green-100 flex items-center justify-center shrink-0
              group-hover:bg-kharis-green-200 dark:group-hover:bg-kharis-green-800 transition-colors">
              <QrCode className="w-6 h-6 text-kharis-green-700" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-gray-800 dark:text-neutral-100 group-hover:text-kharis-green-700 transition-colors">
                QR Code Generator
              </p>
              <p className="text-xs text-gray-500 dark:text-neutral-300 mt-0.5">
                Generate branded QR codes with download options.
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-300 dark:text-neutral-500 group-hover:text-kharis-green-500 group-hover:translate-x-0.5 transition-all shrink-0" />
          </Link>

          <Link
            href="/admin/analytics"
            className="group flex items-center gap-4 p-5 bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800
              hover:border-kharis-green-300 dark:hover:border-kharis-green-600 hover:shadow-md hover:-translate-y-0.5
              active:translate-y-0 active:shadow-sm
              transition-all duration-200 text-left"
          >
            <div className="w-12 h-12 rounded-xl bg-kharis-gold-100 flex items-center justify-center shrink-0
              group-hover:bg-kharis-gold-200 dark:group-hover:bg-kharis-gold-800 transition-colors">
              <BarChart3 className="w-6 h-6 text-kharis-gold-700" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-gray-800 dark:text-neutral-100 group-hover:text-kharis-green-700 transition-colors">
                Analytics
              </p>
              <p className="text-xs text-gray-500 dark:text-neutral-300 mt-0.5">
                View scan statistics and device breakdowns.
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-300 dark:text-neutral-500 group-hover:text-kharis-gold-600 group-hover:translate-x-0.5 transition-all shrink-0" />
          </Link>
        </div>
      </div>
    </div>
  );
}
