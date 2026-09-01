import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSupabaseAdmin } from "@/lib/supabase";

const SESSION_COOKIE = "bcn_admin_session";
const SESSION_VALUE = "authenticated";

export async function POST(request: Request) {
  // Verify session cookie
  const session = cookies().get(SESSION_COOKIE);
  if (!session || session.value !== SESSION_VALUE) {
    return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { ticketId, checked_in } = body as {
      ticketId?: string;
      checked_in?: boolean;
    };

    if (!ticketId || typeof checked_in !== "boolean") {
      return NextResponse.json(
        { success: false, message: "Invalid request body." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    const updateData: Record<string, unknown> = { checked_in };
    if (checked_in) {
      updateData.checked_in_at = new Date().toISOString();
    } else {
      updateData.checked_in_at = null;
    }

    const { error } = await supabase
      .from("registrations")
      .update(updateData)
      .eq("ticket_id", ticketId);

    if (error) {
      console.error("[BCN Admin Toggle] Supabase error:", error);
      return NextResponse.json(
        { success: false, message: "Database update failed." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[BCN Admin Toggle] Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}
