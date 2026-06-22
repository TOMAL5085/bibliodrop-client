import {
  type Book,
  getFeaturedBooks,
  getFilteredBooks,
  getBookById,
  getReviewsForBook,
  getSimilarBooks,
} from "@/lib/site-data";
import { normalizeUser, type AppRole } from "@/lib/auth-user";
import {
  clearStoredAuthSession,
  getStoredAuthToken as readStoredAuthToken,
  setStoredAuthSession,
} from "@/lib/auth-session";

type ApiBook = {
  id: string;
  title: string;
  author: string;
  category: string;
  coverImage?: string;
  authorPhoto?: string;
  deliveryFee: number;
  status: string;
  availability: string;
  provider: string;
  providerPhoto?: string;
  providerEmail?: string;
  coverStart?: string;
  coverEnd?: string;
  description?: string;
  rating?: number;
  reviews?: number;
  addedAt?: string;
};

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ||
  process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "") ||
  (typeof window === "undefined" && process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "");

function getStoredAuthToken() {
  return readStoredAuthToken();
}

function resolveApiUrl(path: string) {
  if (apiBaseUrl) {
    return `${apiBaseUrl}${path}`;
  }

  return path;
}

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2500);
  const token = getStoredAuthToken();

  try {
    const headers = new Headers(init?.headers);
    if (token && !headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    const response = await fetch(resolveApiUrl(path), {
      ...init,
      headers,
      signal: controller.signal,
      cache: "no-store",
      credentials: "include",
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as T;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

function toAppUser(user: {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role?: string | null;
  photoUrl?: string | null;
}) {
  return normalizeUser(user);
}

function normalizeApiBook(book: ApiBook) {
  const localFallback = getBookById(book.id);

  return {
    id: book.id,
    title: book.title,
    author: book.author,
    category: book.category,
    deliveryFee: book.deliveryFee,
    status: (book.status as "published" | "unpublished" | "pending_approval") ?? "published",
    availability: (book.availability as "Available" | "Checked Out") ?? "Available",
    provider: book.provider,
    providerRole: localFallback?.providerRole ?? "book owner",
    providerAvatar: localFallback?.providerAvatar ?? "BD",
    providerPhoto: book.providerPhoto ?? localFallback?.providerPhoto ?? "",
    authorPhoto: book.authorPhoto ?? localFallback?.authorPhoto ?? "",
    coverImage: book.coverImage ?? localFallback?.coverImage ?? "",
    coverStart: book.coverStart ?? localFallback?.coverStart ?? "#0f172a",
    coverEnd: book.coverEnd ?? localFallback?.coverEnd ?? "#334155",
    description: book.description ?? localFallback?.description ?? "",
    rating: book.rating ?? localFallback?.rating ?? 4.5,
    reviews: book.reviews ?? localFallback?.reviews ?? 0,
    deliveries: localFallback?.deliveries ?? 0,
    addedAt: book.addedAt ?? localFallback?.addedAt ?? "",
    featured: localFallback?.featured,
  };
}

export async function getFeaturedBooksFromApi() {
  const response = await fetchJson<{ data: ApiBook[] }>("/api/books");
  if (!response?.data) {
    return getFeaturedBooks();
  }

  return response.data
    .filter((book) => book.status === "published")
    .slice(0, 6)
    .map(normalizeApiBook);
}

export async function getBrowseBooksFromApi(filters: {
  query?: string;
  category?: string;
  status?: string;
  fee?: string;
  sort?: string;
}): Promise<Book[]> {
  const booksResponse = await fetchJson<{ data: ApiBook[] }>(
    `/api/books?${new URLSearchParams(
      Object.entries(filters)
        .filter(([, value]) => Boolean(value))
        .map(([key, value]) => [key, String(value)])
    ).toString()}`
  );

  if (!booksResponse?.data) {
    return getFilteredBooks(filters);
  }

  let result = booksResponse.data.map(normalizeApiBook);

  if (filters.fee === "under-120") {
    result = result.filter((book) => book.deliveryFee < 120);
  } else if (filters.fee === "120-140") {
    result = result.filter((book) => book.deliveryFee >= 120 && book.deliveryFee <= 140);
  } else if (filters.fee === "over-140") {
    result = result.filter((book) => book.deliveryFee > 140);
  }

  if (filters.sort === "fee-asc") {
    result = [...result].sort((left, right) => left.deliveryFee - right.deliveryFee);
  } else if (filters.sort === "fee-desc") {
    result = [...result].sort((left, right) => right.deliveryFee - left.deliveryFee);
  } else if (filters.sort === "rating-desc") {
    result = [...result].sort((left, right) => right.rating - left.rating);
  }

  return result;
}

export async function getBookDetailsFromApi(id: string) {
  const response = await fetchJson<{ data: ApiBook; reviews: Array<{ id: string; userEmail?: string; user?: string; date?: string; rating: number; comment: string; verified?: boolean }> }>(
    `/api/books/${id}`
  );
  const localReviews = getReviewsForBook(id);

  if (!response?.data) {
    const localBook = getBookById(id);
    if (!localBook) {
      return null;
    }

    return {
      book: localBook,
      reviews: localReviews,
      similarBooks: getSimilarBooks(localBook),
    };
  }

  const localBook = getBookById(id);
  const book = normalizeApiBook(response.data);
  const reviews = response.reviews.map((review) => ({
    id: review.id,
    user: review.user ?? review.userEmail ?? "Reader",
    date: review.date ?? "",
    rating: review.rating,
    comment: review.comment,
    verified: review.verified ?? false,
  }));
  const resolvedReviews = localReviews.length > reviews.length ? localReviews : reviews;

  return {
    book,
    reviews: resolvedReviews,
    similarBooks: localBook ? getSimilarBooks(localBook) : [],
  };
}

export async function loginUser(payload: { email: string; password: string }) {
  const response = await fetchJson<{
    user: { id: string; name: string; email: string; image?: string | null; role?: string | null };
    token: string;
  }>("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response?.user) {
    return null;
  }

  setStoredAuthSession({ user: toAppUser(response.user), token: response.token });

  return {
    user: toAppUser(response.user),
    token: response.token,
  };
}

export async function registerUser(payload: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  photoUrl?: string;
  role: AppRole;
}) {
  const response = await fetchJson<{
    user: { id: string; name: string; email: string; image?: string | null; role?: string | null };
    token: string | null;
  }>("/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: payload.name,
      email: payload.email,
      password: payload.password,
      image: payload.photoUrl || undefined,
      role: payload.role,
    }),
  });

  if (!response?.user) {
    return null;
  }

  setStoredAuthSession({ user: toAppUser(response.user), token: response.token });

  return {
    user: toAppUser(response.user),
    token: response.token,
  };
}

export async function startGoogleSignIn(callbackURL: string) {
  const response = await fetchJson<{
    url: string;
    redirect: boolean;
  }>("/api/auth/google/start", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      providerId: "google",
      callbackURL,
      disableRedirect: true,
    }),
  });

  return response;
}

export async function logoutUser() {
  clearStoredAuthSession();

  await fetchJson<{ ok: boolean }>("/api/auth/logout", {
    method: "POST",
  });
}

export async function getSession() {
  const response = await fetchJson<{
    user: { id: string; name: string; email: string; image?: string | null; role?: string | null };
  }>("/api/me");

  if (!response?.user) {
    return null;
  }

  const user = toAppUser(response.user);
  setStoredAuthSession({ user, token: getStoredAuthToken() });

  return {
    user,
  };
}

export async function uploadImage(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(resolveApiUrl("/api/uploads/image"), {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  if (!response.ok) {
    return null;
  }

  const data = (await response.json().catch(() => null)) as { url?: string } | null;
  return data?.url ?? null;
}
