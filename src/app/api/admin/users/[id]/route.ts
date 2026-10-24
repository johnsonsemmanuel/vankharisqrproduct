import { NextRequest, NextResponse } from "next/server";
import { checkAuthServer } from "@/lib/admin-auth-server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authed = await checkAuthServer();
    if (!authed) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { role } = body;

    if (!role || !["admin", "viewer"].includes(role)) {
      return NextResponse.json({ ok: false, error: "Invalid role" }, { status: 400 });
    }

    const supabase = await createAdminClient();
    const { error } = await supabase.auth.admin.updateUserById(id, {
      user_metadata: { role },
    });

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("PATCH /api/admin/users/[id] error:", err);
    return NextResponse.json({ ok: false, error: "Failed to update user" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authed = await checkAuthServer();
    if (!authed) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const supabase = await createAdminClient();
    const { error } = await supabase.auth.admin.deleteUser(id);

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("DELETE /api/admin/users/[id] error:", err);
    return NextResponse.json({ ok: false, error: "Failed to delete user" }, { status: 500 });
  }
}