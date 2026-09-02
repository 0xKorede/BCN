import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSupabaseAdmin } from "@/lib/supabase";

const SESSION_COOKIE = "bcn_admin_session";
const SESSION_VALUE = "authenticated";

export async function POST(request: Request) {
  // 1. Verify admin session cookie
  const session = cookies().get(SESSION_COOKIE);
  if (!session || session.value !== SESSION_VALUE) {
    return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { ticketId, id } = body as { ticketId?: string; id?: string };

    if (!ticketId && !id) {
      return NextResponse.json(
        { success: false, message: "Invalid request. Missing ticketId or id." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    // 2. Delete from Supabase
    let query = supabase.from("registrations").delete();
    if (id) {
      query = query.eq("id", id);
    } else if (ticketId) {
      query = query.eq("ticket_id", ticketId);
    }

    const { error } = await query;

    if (error) {
      console.error("[BCN Admin Delete] Supabase delete error:", error);
      return NextResponse.json(
        { success: false, message: "Database deletion failed." },
        { status: 500 }
      );
    }

    console.log(`[BCN Admin Delete] Successfully deleted registration: ${ticketId || id}`);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[BCN Admin Delete] Unexpected error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}
