import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSupabaseAdmin } from "@/lib/supabase";

const SESSION_COOKIE = "bcn_admin_session";
const SESSION_VALUE = "authenticated";
const BUCKET = "team-photos";

function checkAuth(): boolean {
  const session = cookies().get(SESSION_COOKIE);
  return session?.value === SESSION_VALUE;
}

export async function GET() {
  if (!checkAuth()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("team_members")
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) {
      console.error("[Team API GET] DB error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, members: data });
  } catch (err) {
    console.error("[Team API GET] Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!checkAuth()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const name = (formData.get("name") as string | null)?.trim();
    const bio = (formData.get("bio") as string | null)?.trim();
    const file = formData.get("photo") as File | null;

    if (!name || !bio) {
      return NextResponse.json(
        { error: "Name and bio are required" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    // Determine next display_order (max existing + 1, or 0 if none)
    const { data: existingRows } = await supabase
      .from("team_members")
      .select("display_order")
      .order("display_order", { ascending: false })
      .limit(1);

    const maxOrder =
      existingRows && existingRows.length > 0 && typeof existingRows[0].display_order === "number"
        ? existingRows[0].display_order
        : -1;
    const nextOrder = maxOrder + 1;

    let photoUrl: string | null = null;
    let uploadedStorageKey: string | null = null;

    // Upload photo to team-photos if provided
    if (file && file.size > 0 && typeof file.arrayBuffer === "function") {
      const timestamp = Date.now();
      const safeOriginal = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      uploadedStorageKey = `${timestamp}-${safeOriginal}`;

      const arrayBuffer = await file.arrayBuffer();
      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(uploadedStorageKey, arrayBuffer, {
          contentType: file.type || "image/jpeg",
          upsert: false,
        });

      if (uploadError) {
        console.error("[Team API POST] Storage upload error:", uploadError);
        return NextResponse.json({ error: uploadError.message }, { status: 500 });
      }

      const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(uploadedStorageKey);
      photoUrl = urlData.publicUrl;
    }

    // Insert row into team_members
    const { data: member, error: insertError } = await supabase
      .from("team_members")
      .insert({
        name,
        bio,
        photo_url: photoUrl,
        display_order: nextOrder,
      })
      .select()
      .single();

    if (insertError) {
      console.error("[Team API POST] Insert error:", insertError);
      // Clean up uploaded file if DB insert failed
      if (uploadedStorageKey) {
        await supabase.storage.from(BUCKET).remove([uploadedStorageKey]);
      }
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      member,
    });
  } catch (err) {
    console.error("[Team API POST] Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
