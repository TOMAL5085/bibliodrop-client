export type AppRole = "user" | "librarian" | "admin";

export type AppUser = {
  id: string;
  name: string;
  email: string;
  role: AppRole;
  photoUrl?: string;
};

type BetterAuthUserLike = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role?: string | null;
  photoUrl?: string | null;
};

export function normalizeUser(user: BetterAuthUserLike): AppUser {
  const role = user.role === "librarian" || user.role === "admin" ? user.role : "user";

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role,
    photoUrl: user.photoUrl ?? user.image ?? undefined,
  };
}
