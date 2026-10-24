"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldCheck, UserPlus, Mail, Lock, UserCheck, UserX,
  Edit, Trash2, Save, X, Shield, Eye, EyeOff, ChevronLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { checkAuth, loginWithSupabase } from "@/lib/admin-auth";
import Link from "next/link";

interface AdminUser {
  id: string;
  email: string;
  role: "admin" | "viewer";
  createdAt: string;
  lastSignIn?: string;
}

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<"admin" | "viewer">("admin");
  const [error, setError] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showSuccess = (message: string) => setToast({ message, type: "success" });
  const showError = (message: string) => setToast({ message, type: "error" });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const data = await res.json();
        if (data.ok && data.users) {
          setUsers(data.users);
        }
      }
    } catch {
      // fallback to localStorage for demo
      try {
        const saved = localStorage.getItem("kharis_admin_users");
        if (saved) setUsers(JSON.parse(saved));
      } catch {}
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }
    if (!email.endsWith("@vankharis.com")) {
      setError("Only @vankharis.com emails are allowed");
      return;
    }

    setAdding(true);
    setError("");

    const result = await loginWithSupabase(email, password);
    
    if (!result.success) {
      setError(result.error || "Failed to create user");
      setAdding(false);
      return;
    }

    // If Supabase auth succeeded, we need to also call the API to set the role
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.ok && data.user) {
          setUsers((prev) => [...prev, data.user]);
          setEmail("");
          setPassword("");
          setRole("admin");
          showSuccess("Admin user created successfully");
        } else {
          showError(data.error || "Failed to save user role");
        }
      } else {
        showError("Failed to save user role");
      }
    } catch {
      showError("Failed to save user role");
    } finally {
      setAdding(false);
    }
  };

  const handleUpdateRole = async (id: string, newRole: "admin" | "viewer") => {
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u.id === id ? { ...u, role: newRole } : u))
        );
        showSuccess(`User role updated to ${newRole}`);
      } else {
        showError("Failed to update role");
      }
    } catch {
      showError("Failed to update role");
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm("Delete this admin user? This cannot be undone.")) return;

    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u.id !== id));
        showSuccess("Admin user deleted");
      } else {
        showError("Failed to delete user");
      }
    } catch {
      showError("Failed to delete user");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-700" />
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
            Admin Users
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Manage admin access to the Operations Console.
          </p>
        </div>
      </div>

      {/* Add User Form */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 mb-6">
        <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2">
          <UserPlus className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          Add New Admin
        </h3>
        <form onSubmit={handleAddUser} className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-sm">
              {error}
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  placeholder="admin@vankharis.com"
                  disabled={adding}
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 disabled:opacity-50"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={adding}
                  className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as "admin" | "viewer")}
                disabled={adding}
                className="w-full px-3 py-2.5 text-sm rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 disabled:opacity-50"
              >
                <option value="admin">Admin</option>
                <option value="viewer">Viewer</option>
              </select>
            </div>
          </div>
          <Button type="submit" className="w-full sm:w-auto rounded-xl" loading={adding}>
            {adding ? "Creating..." : "Create Admin User"}
            <ShieldCheck className="w-4 h-4 ml-1.5" />
          </Button>
        </form>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
        {users.length === 0 ? (
          <div className="p-8 text-center text-neutral-400 dark:text-neutral-500">
            <ShieldCheck className="w-12 h-12 mx-auto mb-3 text-neutral-300 dark:text-neutral-600" />
            <p className="text-sm">No admin users yet</p>
            <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">Create the first admin user above</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50 dark:bg-neutral-900">
                <tr className="border-b border-neutral-200 dark:border-neutral-800">
                  <th className="px-4 py-3 text-left font-semibold text-neutral-600 dark:text-neutral-400">Email</th>
                  <th className="px-4 py-3 text-left font-semibold text-neutral-600 dark:text-neutral-400">Role</th>
                  <th className="px-4 py-3 text-left font-semibold text-neutral-600 dark:text-neutral-400">Created</th>
                  <th className="px-4 py-3 text-left font-semibold text-neutral-600 dark:text-neutral-400">Last Sign In</th>
                  <th className="px-4 py-3 text-right font-semibold text-neutral-600 dark:text-neutral-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900/50 flex items-center justify-center">
                          <ShieldCheck className="w-4 h-4 text-brand-700 dark:text-brand-300" />
                        </div>
                        <span className="font-medium text-neutral-900 dark:text-neutral-100">{user.email}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        user.role === "admin"
                          ? "bg-brand-100 dark:bg-brand-900/60 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-700"
                          : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-neutral-500 dark:text-neutral-400">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-neutral-500 dark:text-neutral-400">
                      {user.lastSignIn ? new Date(user.lastSignIn).toLocaleDateString() : "Never"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleUpdateRole(user.id, user.role === "admin" ? "viewer" : "admin")}
                          className={user.role === "admin" ? "text-rose-600 hover:text-rose-700" : "text-brand-600 hover:text-brand-700"}
                        >
                          {user.role === "admin" ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteUser(user.id)}
                          className="hidden sm:flex"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Info Card */}
      <div className="mt-6 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5">
        <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mb-3 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          Access Policy
        </h3>
        <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
          <li className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            Only @vankharis.com emails can be added as admin users
          </li>
          <li className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            <strong>Admin</strong> — Full access to all console features
          </li>
          <li className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            <strong>Viewer</strong> — Read-only access to analytics and feedback
          </li>
          <li className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            All changes sync to Supabase Auth in real-time
          </li>
        </ul>
      </div>
      {toast && (
        <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-right-4">
          <div className={`flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg ${
            toast.type === "success"
              ? "bg-brand-600 text-white"
              : "bg-rose-600 text-white"
          }`}>
            {toast.message}
          </div>
        </div>
      )}
    </div>
  );
}