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
    const { id, storageKey, url } = (await req.json()) as {
      id: string;
      storageKey?: string;
      url?: string;
    };

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    // Determine storage key from parameter, url, or DB lookup
    let keyToDelete = storageKey;
    if (!keyToDelete && url) {
      const match = url.match(/\/event-media\/([^?]+)/);
      if (match) {
        keyToDelete = decodeURIComponent(match[1]);
      }
    }

    if (!keyToDelete) {
      const { data: dbItem } = await supabase
        .from("media")
        .select("url")
        .eq("id", id)
        .single();

      if (dbItem?.url) {
        const match = dbItem.url.match(/\/event-media\/([^?]+)/);
        if (match) {
          keyToDelete = decodeURIComponent(match[1]);
        }
      }
    }

    // Remove from storage if key was resolved (with timeout guard so DB delete is never blocked)
    if (keyToDelete) {
      try {
        await Promise.race([
          supabase.storage.from(BUCKET).remove([keyToDelete]),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Storage delete timeout")), 4000)
          ),
        ]);
      } catch (storageError: unknown) {
        const msg = storageError instanceof Error ? storageError.message : "Storage error";
        console.warn("[Gallery Delete] Storage remove warning:", msg);
      }
    }

    // Delete DB row
    const { error: dbError } = await supabase.from("media").delete().eq("id", id);
    if (dbError) {
      console.error("[Gallery Delete] DB delete error:", dbError);
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[Gallery Delete] Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
