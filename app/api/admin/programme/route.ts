import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSupabaseAdmin } from "@/lib/supabase";

const SESSION_COOKIE = "bcn_admin_session";
const SESSION_VALUE = "authenticated";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("event_status")
      .select("current_item_id")
      .eq("id", 1)
      .maybeSingle();

    if (error) {
      console.error("[Programme API] Error fetching event_status:", error);
      return NextResponse.json({ current_item_id: null }, { status: 200 });
    }

    return NextResponse.json({ current_item_id: data?.current_item_id ?? null });
  } catch (err) {
    console.error("[Programme API] Unexpected error:", err);
    return NextResponse.json({ current_item_id: null }, { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  // Auth check
  const session = cookies().get(SESSION_COOKIE);
  if (session?.value !== SESSION_VALUE) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const current_item_id =
      typeof body.current_item_id === "number" ? body.current_item_id : null;

    const supabase = getSupabaseAdmin();

    const { error } = await supabase
      .from("event_status")
      .upsert(
        {
          id: 1,
          current_item_id,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      );

    if (error) {
      console.error("[Programme API] Error updating event_status:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, current_item_id });
  } catch (err) {
    console.error("[Programme API] Unexpected error on POST:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
