import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSupabaseAdmin } from "@/lib/supabase";

const SESSION_COOKIE = "bcn_admin_session";
const SESSION_VALUE = "authenticated";

function checkAuth(): boolean {
  const session = cookies().get(SESSION_COOKIE);
  return session?.value === SESSION_VALUE;
}

export async function POST(req: NextRequest) {
  if (!checkAuth()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, direction, items } = body as {
      id?: string;
      direction?: "up" | "down";
      items?: { id: string; display_order: number }[];
    };

    const supabase = getSupabaseAdmin();

    // If explicit items array with display_order provided
    if (Array.isArray(items) && items.length > 0) {
      for (const item of items) {
        await supabase
          .from("team_members")
          .update({ display_order: item.display_order })
          .eq("id", item.id);
      }
      return NextResponse.json({ success: true });
    }

    // If id and direction provided
    if (id && (direction === "up" || direction === "down")) {
      const { data: allMembers, error } = await supabase
        .from("team_members")
        .select("*")
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: true });

      if (error || !allMembers) {
        return NextResponse.json({ error: error?.message || "Failed to fetch" }, { status: 500 });
      }

      const currentIndex = allMembers.findIndex((m) => m.id === id);
      if (currentIndex === -1) {
        return NextResponse.json({ error: "Member not found" }, { status: 404 });
      }

      const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
      if (targetIndex < 0 || targetIndex >= allMembers.length) {
        // Already at top or bottom
        return NextResponse.json({ success: true, members: allMembers });
      }

      const currentItem = allMembers[currentIndex];
      const targetItem = allMembers[targetIndex];

      // Assign normalized integer indices so order is strictly deterministic
      const updates = allMembers.map((m, idx) => {
        if (idx === currentIndex) {
          return { id: m.id, display_order: targetIndex };
        }
        if (idx === targetIndex) {
          return { id: m.id, display_order: currentIndex };
        }
        return { id: m.id, display_order: idx };
      });

      // Update swapped items
      await Promise.all([
        supabase
          .from("team_members")
          .update({ display_order: updates[currentIndex].display_order })
          .eq("id", currentItem.id),
        supabase
          .from("team_members")
          .update({ display_order: updates[targetIndex].display_order })
          .eq("id", targetItem.id),
      ]);

      const { data: updatedList } = await supabase
        .from("team_members")
        .select("*")
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: true });

      return NextResponse.json({ success: true, members: updatedList });
    }

    return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
  } catch (err) {
    console.error("[Team API REORDER] Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
