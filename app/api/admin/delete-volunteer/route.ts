import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

const SESSION_COOKIE = "bcn_admin_session";
const SESSION_VALUE = "authenticated";

export async function POST(request: Request) {
  // Auth guard
  const session = cookies().get(SESSION_COOKIE);
  if (session?.value !== SESSION_VALUE) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { ticketId, id } = await request.json();

    if (!ticketId && !id) {
      return NextResponse.json(
        { success: false, message: "ticketId or id is required" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    // Delete by ticket_id (preferred) or by UUID id
    const query = ticketId
      ? supabase.from("volunteers").delete().eq("ticket_id", ticketId)
      : supabase.from("volunteers").delete().eq("id", id);

    const { error } = await query;

    if (error) {
      console.error("[BCN Admin] Delete volunteer error:", error);
      return NextResponse.json(
        { success: false, message: "Failed to delete volunteer." },
        { status: 500 }
      );
    }

    console.log(`[BCN Admin] Deleted volunteer: ticket_id=${ticketId ?? ""} id=${id ?? ""}`);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("[BCN Admin] Unexpected error deleting volunteer:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}
