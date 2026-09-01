import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const SESSION_COOKIE = "bcn_admin_session";
const SESSION_VALUE = "authenticated";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = body as { password?: string };

    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
      console.error("[BCN Admin] ADMIN_PASSWORD env var is not set");
      return NextResponse.json(
        { success: false, message: "Server configuration error." },
        { status: 500 }
      );
    }

    if (!password || password !== adminPassword) {
      return NextResponse.json(
        { success: false, message: "Incorrect password." },
        { status: 401 }
      );
    }

    // Set an httpOnly session cookie — valid for 8 hours (event day use)
    cookies().set(SESSION_COOKIE, SESSION_VALUE, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 8,
      path: "/",
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[BCN Admin Login] Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}
