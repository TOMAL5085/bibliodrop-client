import Link from "next/link";
import { ArrowRight, Filter, Search } from "lucide-react";
import { BookCard } from "@/components/book-card";
import { SectionHeading } from "@/components/section-heading";
import { categories } from "@/lib/site-data";
import { getBrowseBooksFromApi } from "@/lib/api";

function normalizeParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function BrowseBooksPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const query = normalizeParam(params.query) ?? "";
  const category = normalizeParam(params.category) ?? "";
  const status = normalizeParam(params.status) ?? "";
  const fee = normalizeParam(params.fee) ?? "";
  const sort = normalizeParam(params.sort) ?? "featured";
  const page = Number.parseInt(normalizeParam(params.page) ?? "1", 10) || 1;

  const filteredBooks = await getBrowseBooksFromApi({
    query,
    category,
    status,
    fee,
    sort,
  });

  const pageSize = 8;
  const totalPages = Math.max(1, Math.ceil(filteredBooks.length / pageSize));
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedBooks = filteredBooks.slice(startIndex, startIndex + pageSize);

  const makeLink = (updates: Record<string, string | number | undefined>) => {
    const next = new URLSearchParams();
    const entries = {
      query,
      category,
      status,
      fee,
      sort,
      page: currentPage,
      ...updates,
    };

    Object.entries(entries).forEach(([key, value]) => {
      if (value !== undefined && value !== "" && value !== 1) {
        next.set(key, String(value));
      }
    });

    return `/browse-books?${next.toString()}`;
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Browse books"
        title="Search, filter, and sort the public library shelf."
        description="Guests and signed-in users can explore published books. Delivery requests and reviews are reserved for authenticated users."
      />

      <form
        method="get"
        className="glass-panel mt-10 grid gap-4 rounded-[2rem] p-5 lg:grid-cols-[1.3fr_0.9fr_0.8fr_0.8fr_0.8fr_auto]"
      >
        <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
          <Search className="h-4 w-4 text-slate-500" />
          <input
            name="query"
            defaultValue={query}
            placeholder="Search by title, author, or description"
            className="w-full bg-transparent text-sm outline-none"
          />
        </label>

        <select
          name="category"
          defaultValue={category}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
        >
          <option value="">All categories</option>
          {categories.map((item) => (
            <option key={item.slug} value={item.name}>
              {item.name}
            </option>
          ))}
        </select>

        <select
          name="status"
          defaultValue={status}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
        >
          <option value="">Availability</option>
          <option value="available">Available</option>
          <option value="checked out">Checked out</option>
        </select>

        <select
          name="fee"
          defaultValue={fee}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
        >
          <option value="">Fee range</option>
          <option value="under-120">Under 120</option>
          <option value="120-140">120 - 140</option>
          <option value="over-140">Over 140</option>
        </select>

        <select
          name="sort"
          defaultValue={sort}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
        >
          <option value="featured">Featured first</option>
          <option value="rating-desc">Top rated</option>
          <option value="fee-asc">Fee low to high</option>
          <option value="fee-desc">Fee high to low</option>
        </select>

        <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white">
          <Filter className="h-4 w-4" />
          Apply
        </button>
      </form>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-600">
          Showing <span className="font-semibold text-slate-950">{paginatedBooks.length}</span> of{" "}
          <span className="font-semibold text-slate-950">{filteredBooks.length}</span> published books
        </p>
        <Link href="/register" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-950">
          Need an account for delivery requests?
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {paginatedBooks.length ? (
        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {paginatedBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-[2rem] border border-dashed border-slate-300 bg-white p-10 text-center">
          <p className="text-lg font-semibold text-slate-950">No books match those filters.</p>
          <p className="mt-3 text-sm text-slate-600">Try clearing one filter or searching a different title.</p>
        </div>
      )}

      <div className="mt-10 flex items-center justify-between gap-4">
        <Link
          href={makeLink({ page: Math.max(1, currentPage - 1) })}
          className={`rounded-full px-5 py-3 text-sm font-semibold ${
            currentPage === 1
              ? "pointer-events-none bg-slate-200 text-slate-400"
              : "bg-slate-950 text-white"
          }`}
        >
          Previous
        </Link>
        <div className="text-sm font-medium text-slate-600">
          Page {currentPage} of {totalPages}
        </div>
        <Link
          href={makeLink({ page: Math.min(totalPages, currentPage + 1) })}
          className={`rounded-full px-5 py-3 text-sm font-semibold ${
            currentPage === totalPages
              ? "pointer-events-none bg-slate-200 text-slate-400"
              : "bg-slate-950 text-white"
          }`}
        >
          Next
        </Link>
      </div>
    </div>
  );
}
