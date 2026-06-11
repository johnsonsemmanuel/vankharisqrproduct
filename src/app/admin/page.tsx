"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { QrCode, BarChart3, ShieldAlert, LogIn } from "lucide-react";
import { checkAuth, login } from "@/lib/admin-auth";
import { Button } from "@/components/ui/button";

export default function AdminPage() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
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
      <div className="min-h-dvh bg-gray-50 flex items-center justify-center p-5">
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-kharis-green-100 flex items-center justify-center mb-4">
              <ShieldAlert className="w-6 h-6 text-kharis-green-700" />
            </div>
            <h1 className="text-lg font-bold text-gray-800 mb-1">Admin Access</h1>
            <p className="text-sm text-gray-500 mb-6">
              Enter password to access the admin dashboard.
            </p>

            <form
              onSubmit={(e) => { e.preventDefault(); handleLogin(); }}
              className="space-y-4"
            >
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(false); }}
                placeholder="Password"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm
                  focus:outline-none focus:ring-2 focus:ring-kharis-green-500/30 focus:border-kharis-green-500
                  placeholder:text-gray-400"
                autoFocus
              />
              {error && (
                <p className="text-xs text-red-500 text-center">Incorrect password.</p>
              )}
              <Button
                type="submit"
                className="w-full"
              >
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
    <div className="min-h-dvh bg-gray-50">
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-5 h-14 max-w-lg mx-auto">
          <div className="flex items-center gap-2">
            <img
              src="/images/kharisfoods-removebg-preview.png"
              alt="Kharis Foods"
              className="h-6 w-auto"
            />
            <h1 className="font-bold text-gray-800 text-sm">Admin</h1>
          </div>
          <span className="text-xs text-gray-400">Internal Use</span>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-5 py-12">
        <div className="text-center mb-8">
          <h2 className="text-lg font-bold text-gray-800">Dashboard</h2>
          <p className="text-sm text-gray-500 mt-1">Manage QR codes and view scan analytics.</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => router.push("/admin/qr")}
            className="w-full flex items-center gap-4 p-5 bg-white rounded-xl border border-gray-200
              hover:border-kharis-green-300 hover:shadow-sm active:bg-gray-50 transition-all text-left"
          >
            <div className="w-12 h-12 rounded-xl bg-kharis-green-100 flex items-center justify-center shrink-0">
              <QrCode className="w-6 h-6 text-kharis-green-700" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-gray-800">QR Code Generator</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Generate branded QR codes with download options.
              </p>
            </div>
          </button>

          <button
            onClick={() => router.push("/admin/analytics")}
            className="w-full flex items-center gap-4 p-5 bg-white rounded-xl border border-gray-200
              hover:border-kharis-green-300 hover:shadow-sm active:bg-gray-50 transition-all text-left"
          >
            <div className="w-12 h-12 rounded-xl bg-kharis-gold-100 flex items-center justify-center shrink-0">
              <BarChart3 className="w-6 h-6 text-kharis-gold-700" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-gray-800">Analytics</p>
              <p className="text-xs text-gray-500 mt-0.5">
                View scan statistics and device breakdowns.
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
