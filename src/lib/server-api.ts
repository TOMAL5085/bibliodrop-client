import {
  listDeliveries,
  listBooks,
  listAllReviews,
  listTransactions,
  countBooks,
} from "@/lib/persistence";

function getServerApiBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ||
    process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "") ||
    ""
  );
}

async function fetchFromApi<T>(path: string): Promise<T | null> {
  const baseUrl = getServerApiBaseUrl();
  if (!baseUrl) {
    return null;
  }

  try {
    const response = await fetch(`${baseUrl}${path}`, { cache: "no-store" });
    if (!response.ok) {
      return null;
    }

    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export async function getDeliveriesForPage() {
  const response = await fetchFromApi<{ data: Array<{ id: string; date: string; status: string; userEmail?: string; bookId?: string; amount?: number }> }>(
    "/api/deliveries"
  );

  // Always merge API response with local deliveries to avoid missing seeded local data
  const local = await listDeliveries();

  if (response?.data) {
    const mergedMap = new Map<string, any>();

    // Add local entries first
    for (const d of local) {
      mergedMap.set(d.id, d);
    }

    // Overwrite/add entries from API
    for (const d of response.data) {
      mergedMap.set(d.id, d);
    }

    return Array.from(mergedMap.values());
  }

  return local;
}

export async function getBooksCountForPage(filters?: {
  query?: string;
  category?: string;
  status?: string;
}) {
  const params = new URLSearchParams();
  if (filters?.query) params.set("query", filters.query);
  if (filters?.category) params.set("category", filters.category);
  if (filters?.status) params.set("status", filters.status);

  const query = params.toString();
  const response = await fetchFromApi<{ data: unknown[] }>(
    query ? `/api/books?${query}` : "/api/books"
  );

  if (response?.data) {
    return response.data.length;
  }

  return await countBooks(filters ?? {});
}

export async function getTransactionsForPage() {
  const response = await fetchFromApi<{ data: unknown[] }>("/api/transactions");
  if (response?.data) {
    return response.data;
  }

  return await listTransactions();
}

export async function getBooksForPage() {
  const response = await fetchFromApi<{ data: unknown[] }>("/api/books");
  if (response?.data) {
    return response.data;
  }

  return await listBooks({});
}

export async function getReviewsForPage() {
  const response = await fetchFromApi<{ data: unknown[] }>("/api/reviews");
  if (response?.data) {
    return response.data;
  }

  return await listAllReviews();
}
