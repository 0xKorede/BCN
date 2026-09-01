import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const SESSION_COOKIE = "bcn_admin_session";

export async function POST() {
  cookies().delete(SESSION_COOKIE);
  return NextResponse.json({ success: true }, { status: 200 });
}
