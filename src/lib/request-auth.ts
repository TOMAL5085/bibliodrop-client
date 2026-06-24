import jwt from "jsonwebtoken";
import { findUserById } from "@/lib/persistence";
import { verifyAuthToken } from "@/lib/server-auth";

type TokenPayload = {
  sub: string;
  email: string;
  role: string;
  name: string;
};

function authSecret() {
  return process.env.BETTER_AUTH_SECRET || process.env.JWT_SECRET || "bibliodrop-dev-secret";
}

function verifyServerAuthToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, authSecret()) as TokenPayload;
  } catch {
    return null;
  }
}

function extractBearerToken(request: Request) {
  const authHeader = request.headers.get("authorization") || "";
  if (!authHeader.startsWith("Bearer ")) {
    return "";
  }

  return authHeader.slice(7).trim();
}

export async function getRequestUser(request: Request) {
  const token = extractBearerToken(request);
  if (!token) {
    return null;
  }

  const serverPayload = verifyServerAuthToken(token);
  if (serverPayload?.sub) {
    return findUserById(serverPayload.sub);
  }

  try {
    const localPayload = verifyAuthToken(token);
    if (!localPayload?.sub) {
      return null;
    }

    return findUserById(localPayload.sub);
  } catch {
    return null;
  }
}
