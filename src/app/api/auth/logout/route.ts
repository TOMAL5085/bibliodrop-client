import { NextResponse } from "next/server";
import { authCookieOptions } from "@/lib/server-auth";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: "bibliodrop_token",
    value: "",
    ...authCookieOptions(),
    expires: new Date(0),
  });
  return response;
}
