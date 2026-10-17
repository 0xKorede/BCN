import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSupabaseAdmin } from "@/lib/supabase";

const SESSION_COOKIE = "bcn_admin_session";
const SESSION_VALUE = "authenticated";
const BUCKET = "event-media";

export async function POST(req: NextRequest) {
  // Auth check
  const session = cookies().get(SESSION_COOKIE);
  if (session?.value !== SESSION_VALUE) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const caption = (formData.get("caption") as string | null) ?? null;
    const eventId = formData.get("eventId") as string | null;

    if (!file || !eventId) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const timestamp = Date.now();
    const safeOriginal = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const storageKey = `${timestamp}-${safeOriginal}`;

    // Upload to storage
    const arrayBuffer = await file.arrayBuffer();
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(storageKey, arrayBuffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("[Gallery Upload] Storage error:", uploadError);
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    // Get public URL
    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(storageKey);
    const publicUrl = urlData.publicUrl;

    // Infer type from MIME
    const mediaType = file.type.startsWith("video/") ? "video" : "image";

    // Insert media row (omitting storage_key to match current DB schema)
    const { data: row, error: insertError } = await supabase
      .from("media")
      .insert({
        url: publicUrl,
        type: mediaType,
        caption: caption || null,
        uploaded_at: new Date().toISOString(),
        event_id: eventId,
      })
      .select()
      .single();

    if (insertError) {
      console.error("[Gallery Upload] DB insert error:", insertError);
      // Attempt to clean up orphan storage file
      await supabase.storage.from(BUCKET).remove([storageKey]);
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      item: {
        ...row,
        storage_key: storageKey,
      },
    });
  } catch (err) {
    console.error("[Gallery Upload] Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
