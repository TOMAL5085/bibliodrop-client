import crypto from "node:crypto";

export type AuthRole = "user" | "librarian" | "admin";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: AuthRole;
  photoUrl: string;
  passwordHash: string;
};

const jwtSecret = process.env.JWT_SECRET || "bibliodrop-dev-secret";
const passwordKeyLength = 64;
const passwordDigest = "sha512";

function base64UrlEncode(input: Buffer | string) {
  return Buffer.from(input).toString("base64url");
}

function base64UrlDecode(input: string) {
  return Buffer.from(input, "base64url").toString("utf8");
}

export function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const derived = crypto.scryptSync(password, salt, passwordKeyLength, {
    N: 16384,
    r: 8,
    p: 1,
  });
  return `${salt}:${derived.toString("hex")}`;
}

export function verifyPassword(password: string, hashedPassword: string) {
  const [salt, storedHash] = hashedPassword.split(":");
  if (!salt || !storedHash) {
    return false;
  }

  const derived = crypto.scryptSync(password, salt, passwordKeyLength, {
    N: 16384,
    r: 8,
    p: 1,
  });
  const expected = Buffer.from(storedHash, "hex");

  return (
    expected.length === derived.length && crypto.timingSafeEqual(expected, derived)
  );
}

export function signAuthToken(
  user: Pick<AuthUser, "id" | "email" | "role" | "name">,
  expiresInSeconds = 60 * 60 * 24 * 7
) {
  const header = { alg: "HS256", typ: "JWT" };
  const issuedAt = Math.floor(Date.now() / 1000);
  const payload = {
    sub: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
    iat: issuedAt,
    exp: issuedAt + expiresInSeconds,
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signature = crypto
    .createHmac(passwordDigest, jwtSecret)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest("base64url");

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

export function verifyAuthToken(token: string) {
  const [encodedHeader, encodedPayload, providedSignature] = token.split(".");

  if (!encodedHeader || !encodedPayload || !providedSignature) {
    throw new Error("Invalid token");
  }

  const expectedSignature = crypto
    .createHmac(passwordDigest, jwtSecret)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest("base64url");

  const expectedBuffer = Buffer.from(expectedSignature);
  const providedBuffer = Buffer.from(providedSignature);

  if (
    expectedBuffer.length !== providedBuffer.length ||
    !crypto.timingSafeEqual(expectedBuffer, providedBuffer)
  ) {
    throw new Error("Invalid token");
  }

  const payload = JSON.parse(base64UrlDecode(encodedPayload)) as {
    sub: string;
    email: string;
    role: string;
    name: string;
    iat?: number;
    exp?: number;
  };

  if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
    throw new Error("Token expired");
  }

  return payload;
}

export function authCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  };
}
