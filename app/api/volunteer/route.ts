import { NextResponse } from "next/server";
import { volunteerSchema } from "@/lib/validations";
import { getSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // ── 1. Validate ──────────────────────────────────────────────────────────
    const validationResult = volunteerSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, errors: validationResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    const { name, email, role, whatsapp, motivation } = validationResult.data;

    // ── 2. Generate ticket ID (8-char uppercase alphanumeric) ─────────────────
    const { customAlphabet } = await import("nanoid");
    const nanoid = customAlphabet("ABCDEFGHJKLMNPQRSTUVWXYZ23456789", 8);
    const ticketId = nanoid();

    // ── 3. Save to Supabase volunteers table ──────────────────────────────────
    const supabase = getSupabaseAdmin();
    const insertPayload: Record<string, any> = {
      name,
      email,
      role,
      whatsapp,
      motivation: motivation || null,
      ticket_id: ticketId,
    };

    const { error: dbError } = await supabase.from("volunteers").insert(insertPayload);

    if (dbError) {
      // Duplicate email check
      if (dbError.code === "23505") {
        return NextResponse.json(
          { success: false, message: "This email has already been submitted as a volunteer." },
          { status: 409 }
        );
      }
      console.error("[BCN Volunteer] Supabase insert error:", dbError);
      return NextResponse.json(
        { success: false, message: "Submission failed. Please try again." },
        { status: 500 }
      );
    }

    // ── 4. Return success ─────────────────────────────────────────────────────
    console.log(`[BCN Volunteer] New volunteer: ${name} (${email}) — Ref: ${ticketId}`);

    return NextResponse.json({ success: true, ticketId }, { status: 200 });
  } catch (error) {
    console.error("[BCN Volunteer] Unexpected error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error. Please try again." },
      { status: 500 }
    );
  }
}
