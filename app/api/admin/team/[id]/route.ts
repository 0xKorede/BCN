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

function extractStorageKey(url: string | null | undefined): string | null {
  if (!url) return null;
  const match = url.match(/\/team-photos\/([^?]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!checkAuth()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;
  if (!id) {
    return NextResponse.json({ error: "Member ID is required" }, { status: 400 });
  }

  try {
    const formData = await req.formData();
    const name = (formData.get("name") as string | null)?.trim();
    const bio = (formData.get("bio") as string | null)?.trim();
    const file = formData.get("photo") as File | null;
    const removePhoto = formData.get("remove_photo") === "true";

    const supabase = getSupabaseAdmin();

    // Fetch existing member to check old photo
    const { data: currentMember, error: fetchError } = await supabase
      .from("team_members")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !currentMember) {
      return NextResponse.json({ error: "Team member not found" }, { status: 404 });
    }

    const updates: Record<string, unknown> = {};
    if (name) updates.name = name;
    if (bio) updates.bio = bio;

    let newStorageKey: string | null = null;
    const oldStorageKey = extractStorageKey(currentMember.photo_url);

    // If new photo uploaded
    if (file && file.size > 0 && typeof file.arrayBuffer === "function") {
      const timestamp = Date.now();
      const safeOriginal = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      newStorageKey = `${timestamp}-${safeOriginal}`;

      const arrayBuffer = await file.arrayBuffer();
      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(newStorageKey, arrayBuffer, {
          contentType: file.type || "image/jpeg",
          upsert: false,
        });

      if (uploadError) {
        console.error("[Team API PATCH] Storage upload error:", uploadError);
        return NextResponse.json({ error: uploadError.message }, { status: 500 });
      }

      const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(newStorageKey);
      updates.photo_url = urlData.publicUrl;

      // Delete old photo file if it was previously uploaded
      if (oldStorageKey) {
        try {
          await supabase.storage.from(BUCKET).remove([oldStorageKey]);
        } catch (e) {
          console.warn("[Team API PATCH] Old photo removal warning:", e);
        }
      }
    } else if (removePhoto) {
      updates.photo_url = null;
      if (oldStorageKey) {
        try {
          await supabase.storage.from(BUCKET).remove([oldStorageKey]);
        } catch (e) {
          console.warn("[Team API PATCH] Old photo removal warning:", e);
        }
      }
    }

    const { data: updatedMember, error: updateError } = await supabase
      .from("team_members")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      console.error("[Team API PATCH] Update error:", updateError);
      if (newStorageKey) {
        await supabase.storage.from(BUCKET).remove([newStorageKey]);
      }
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, member: updatedMember });
  } catch (err) {
    console.error("[Team API PATCH] Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!checkAuth()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;
  if (!id) {
    return NextResponse.json({ error: "Member ID is required" }, { status: 400 });
  }

  try {
    const supabase = getSupabaseAdmin();

    // Fetch existing member to get photo URL
    const { data: currentMember } = await supabase
      .from("team_members")
      .select("photo_url")
      .eq("id", id)
      .single();

    // Remove photo from storage if present
    if (currentMember?.photo_url) {
      const storageKey = extractStorageKey(currentMember.photo_url);
      if (storageKey) {
        try {
          await supabase.storage.from(BUCKET).remove([storageKey]);
        } catch (storageErr) {
          console.warn("[Team API DELETE] Storage delete warning:", storageErr);
        }
      }
    }

    // Delete DB row
    const { error: deleteError } = await supabase
      .from("team_members")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("[Team API DELETE] DB delete error:", deleteError);
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[Team API DELETE] Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
