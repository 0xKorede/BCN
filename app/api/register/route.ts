import { NextResponse } from "next/server";
import { registrationSchema } from "@/lib/validations";
import { getSupabaseAdmin } from "@/lib/supabase";
// import { generateConfirmationEmail } from "@/lib/emailTemplate";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // ── 1. Validate ──────────────────────────────────────────────────────────
    const validationResult = registrationSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, errors: validationResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    const { name, email, role, whatsapp } = validationResult.data;

    const supabase = getSupabaseAdmin();
    let eventQuery = supabase.from("events").select("id, status, is_paid");
    eventQuery = body.eventId ? eventQuery.eq("id", body.eventId) : eventQuery.eq("slug", body.eventSlug || "");
    const { data: event, error: eventError } = await eventQuery.maybeSingle();
    if (eventError || !event) return NextResponse.json({ success: false, message: "Event not found." }, { status: 404 });
    if (event.status !== "upcoming") return NextResponse.json({ success: false, message: "Registration is closed for this event." }, { status: 403 });
    if (event.is_paid) return NextResponse.json({ success: false, message: "This paid event requires checkout." }, { status: 403 });

    // ── 2. Generate ticket ID (8-char uppercase alphanumeric) ─────────────────
    const { customAlphabet } = await import("nanoid");
    const nanoid = customAlphabet("ABCDEFGHJKLMNPQRSTUVWXYZ23456789", 8);
    const ticketId = nanoid();

    // ── 3. Save to Supabase ───────────────────────────────────────────────────
    const insertPayload: Record<string, any> = {
      name,
      email,
      role,
      whatsapp,
      ticket_id: ticketId,
      checked_in: false,
      event_id: event.id,
    };

    let { error: dbError } = await supabase.from("registrations").insert(insertPayload);

    // Fallback: If Supabase table does not have 'whatsapp' column yet, retry insert without it
    if (
      dbError &&
      (dbError.message?.toLowerCase().includes("whatsapp") ||
        dbError.details?.toLowerCase().includes("whatsapp") ||
        dbError.code === "PGRST204" ||
        dbError.code === "42703")
    ) {
      console.warn(
        "[BCN Register] Warning: 'whatsapp' column does not exist in Supabase 'registrations' table yet. Retrying insert without it."
      );
      console.warn(
        "[BCN Register] To store WhatsApp numbers, run this in Supabase SQL editor: ALTER TABLE registrations ADD COLUMN IF NOT EXISTS whatsapp TEXT;"
      );
      delete insertPayload.whatsapp;
      const retry = await supabase.from("registrations").insert(insertPayload);
      dbError = retry.error;
    }

    if (dbError) {
      // Duplicate email check
      if (dbError.code === "23505") {
        return NextResponse.json(
          { success: false, message: "This email is already registered for BCN Hangout." },
          { status: 409 }
        );
      }
      console.error("[BCN Register] Supabase insert error:", dbError);
      return NextResponse.json(
        { success: false, message: "Registration failed. Please try again." },
        { status: 500 }
      );
    }

    // ── 4. Return success ─────────────────────────────────────────────────────
    console.log(`[BCN Register] New attendee: ${name} (${email}) — Ticket: ${ticketId}`);

    // EMAIL DISABLED — re-enable once domain + Resend are fully configured. See STEP 4/5 in the registration build prompt.
    /*
    // ── 4. Generate QR PNG ────────────────────────────────────────────────────
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://buildingcreativesnetwork.com";
    const checkinUrl = `${siteUrl}/checkin/${ticketId}`;

    let qrBuffer: Buffer;
    try {
      const QRCode = await import("qrcode");
      qrBuffer = await QRCode.toBuffer(checkinUrl, {
        type: "png",
        width: 400,
        margin: 2,
        color: { dark: "#000000", light: "#FFFFFF" },
      });
    } catch (qrError) {
      console.error("[BCN Register] QR generation error:", qrError);
      // Don't fail the registration if QR generation fails
      qrBuffer = Buffer.alloc(0);
    }

    // ── 5. Send confirmation email via Resend ─────────────────────────────────
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);

      const htmlContent = generateConfirmationEmail({ name, role, ticketId });

      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "BCN Hangout <onboarding@resend.dev>",
        to: email,
        subject: `You're registered for BCN Hangout 2026 🎉 — Ticket: ${ticketId}`,
        html: htmlContent,
        attachments: qrBuffer.length > 0
          ? [
              {
                filename: "bcn-checkin-qr.png",
                content: qrBuffer,
                contentId: "qr-code",
              },
            ]
          : [],
      });
    } catch (emailError) {
      // Log but do NOT fail — registration is valid even if email fails
      console.error("[BCN Register] Email delivery error:", emailError);
    }
    */

    return NextResponse.json({ success: true, ticketId }, { status: 200 });
  } catch (error) {
    console.error("[BCN Register] Unexpected error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error. Please try again." },
      { status: 500 }
    );
  }
}
