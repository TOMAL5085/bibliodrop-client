import { NextResponse } from "next/server";
import { findUserByEmail, sanitizeUser, users, type AuthRole } from "@/lib/server-state";
import { hashPassword } from "@/lib/server-auth";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | {
        name?: string;
        email?: string;
        password?: string;
        confirmPassword?: string;
        photoUrl?: string;
        role?: AuthRole;
      }
    | null;

  const name = body?.name?.trim() ?? "";
  const email = body?.email?.trim() ?? "";
  const password = body?.password ?? "";
  const confirmPassword = body?.confirmPassword ?? "";
  const photoUrl = body?.photoUrl?.trim() ?? "";
  const role: AuthRole = body?.role === "librarian" ? "librarian" : "user";

  if (!name || !email || !password || !confirmPassword) {
    return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
  }

  if (password !== confirmPassword) {
    return NextResponse.json({ message: "Passwords do not match" }, { status: 400 });
  }

  if (findUserByEmail(email)) {
    return NextResponse.json({ message: "Email already exists" }, { status: 409 });
  }

  const user = {
    id: `u${users.length + 1}`,
    name,
    email,
    role,
    photoUrl,
    passwordHash: hashPassword(password),
  };

  users.push(user);

  return NextResponse.json(
    {
      user: sanitizeUser(user),
    },
    { status: 201 }
  );
}
