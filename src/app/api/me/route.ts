import { NextRequest, NextResponse } from "next/server";
import { findUserById, sanitizeUser } from "@/lib/server-state";
import { verifyAuthToken } from "@/lib/server-auth";

export function GET(request: NextRequest) {
  const token = request.cookies.get("bibliodrop_token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  try {
    const payload = verifyAuthToken(token);
    const user = findUserById(payload.sub);

    if (!user) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    return NextResponse.json({ user: sanitizeUser(user) });
  } catch {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }
}
