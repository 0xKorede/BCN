import { NextResponse } from "next/server";
import { getSupabaseAdmin, MediaItem } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("media")
      .select("*")
      .order("uploaded_at", { ascending: false });

    if (error) {
      console.error("[API Gallery] Supabase error:", error);
      return NextResponse.json(
        { error: error.message },
        {
          status: 500,
          headers: { "Cache-Control": "no-store, no-cache, must-revalidate" },
        }
      );
    }

    return NextResponse.json(
      { items: (data as MediaItem[]) || [] },
      {
        status: 200,
        headers: { "Cache-Control": "no-store, no-cache, must-revalidate" },
      }
    );
  } catch (err) {
    console.error("[API Gallery] Unexpected error:", err);
    return NextResponse.json(
      { error: "Failed to fetch gallery media" },
      {
        status: 500,
        headers: { "Cache-Control": "no-store, no-cache, must-revalidate" },
      }
    );
  }
}
