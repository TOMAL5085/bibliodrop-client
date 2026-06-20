import { NextResponse } from "next/server";
import { findUserByEmail, sanitizeUser } from "@/lib/server-state";
import { authCookieOptions, signAuthToken, verifyPassword } from "@/lib/server-auth";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | { email?: string; password?: string }
    | null;

  const email = body?.email?.trim() ?? "";
  const password = body?.password ?? "";

  if (!email || !password) {
    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
  }

  const user = findUserByEmail(email);
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
  }

  const token = signAuthToken(user);
  const response = NextResponse.json({
    user: sanitizeUser(user),
    token,
  });

  response.cookies.set("bibliodrop_token", token, authCookieOptions());
  return response;
}
