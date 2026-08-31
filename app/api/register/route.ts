import { NextResponse } from "next/server";
import { registrationSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate payload against Zod schema
    const validationResult = registrationSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          errors: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, email, role } = validationResult.data;

    // Simulate backend processing delay (e.g. database query, sheet API, email dispatch)
    await new Promise((resolve) => setTimeout(resolve, 800));

    /*
     * ------------------------------------------------------------------------
     * INTEGRATION STUB FOR BACKEND WIRING:
     * ------------------------------------------------------------------------
     * 1. Save registration to Supabase / Database:
     *    await supabase.from('registrations').insert({ name, email, role });
     *
     * 2. Append row to Google Sheets API / SheetDB / Zapier:
     *    await fetch(process.env.GOOGLE_SHEETS_WEBHOOK_URL, {
     *      method: 'POST',
     *      body: JSON.stringify({ name, email, role, date: new Date() })
     *    });
     *
     * 3. Send confirmation email via Resend / SendGrid / Nodemailer:
     *    await resend.emails.send({
     *      from: 'BCN Hangout <noreply@bcn.community>',
     *      to: email,
     *      subject: "You're registered for BCN Hangout!",
     *      react: ConfirmationEmail({ name })
     *    });
     * ------------------------------------------------------------------------
     */

    console.log(`[BCN Hangout Registration] New attendee registered: ${name} (${email}) - Role: ${role}`);

    return NextResponse.json(
      {
        success: true,
        message: "Registration successful! We look forward to seeing you at BCN Hangout.",
        data: { name, email, role },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[BCN Hangout Registration Error]:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error. Please try again.",
      },
      { status: 500 }
    );
  }
}
