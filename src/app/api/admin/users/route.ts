import { NextRequest, NextResponse } from "next/server";
import { checkAuthServer } from "@/lib/admin-auth-server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const authed = await checkAuthServer();
    if (!authed) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const supabase = await createAdminClient();
    const { data, error } = await supabase.auth.admin.listUsers();
    
    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    const adminUsers = data.users
      .filter((u) => u.email?.endsWith("@vankharis.com"))
      .map((u) => ({
        id: u.id,
        email: u.email!,
        role: (u.user_metadata?.role as "admin" | "viewer") || "viewer",
        createdAt: u.created_at,
        lastSignIn: u.last_sign_in_at,
      }));

    return NextResponse.json({ ok: true, users: adminUsers });
  } catch (err) {
    console.error("GET /api/admin/users error:", err);
    return NextResponse.json({ ok: false, error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authed = await checkAuthServer();
    if (!authed) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { email, password, role = "admin" } = body;

    if (!email || !password) {
      return NextResponse.json({ ok: false, error: "Email and password are required" }, { status: 400 });
    }
    if (!email.endsWith("@vankharis.com")) {
      return NextResponse.json({ ok: false, error: "Only @vankharis.com emails are allowed" }, { status: 400 });
    }

    const supabase = await createAdminClient();
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { role },
    });

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
    }

    if (data.user) {
      const newUser = {
        id: data.user.id,
        email: data.user.email!,
        role,
        createdAt: new Date().toISOString(),
      };
      return NextResponse.json({ ok: true, user: newUser });
    }

    return NextResponse.json({ ok: false, error: "Failed to create user" }, { status: 500 });
  } catch (err) {
    console.error("POST /api/admin/users error:", err);
    return NextResponse.json({ ok: false, error: "Failed to create user" }, { status: 500 });
  }
}