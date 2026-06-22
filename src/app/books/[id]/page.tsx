import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, BadgeCheck, BookMarked, Lock, Star, Truck } from "lucide-react";
import { BookCard } from "@/components/book-card";
import { SectionHeading } from "@/components/section-heading";
import { ReviewPager } from "@/components/review-pager";
import { getBookDetailsFromApi } from "@/lib/api";
import { getBookById } from "@/lib/site-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const details = await getBookDetailsFromApi(id);
  const book = details?.book ?? getBookById(id);

  if (!book) {
    return {
      title: "Book not found",
    };
  }

  return {
    title: `${book.title}`,
    description: book.description,
  };
}

export default async function BookDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const details = await getBookDetailsFromApi(id);
  const book = details?.book ?? getBookById(id);

  if (!book || book.status !== "published") {
    notFound();
  }

  const reviews = details?.reviews ?? [];
  const similarBooks = details?.similarBooks ?? [];
  const requestDisabled = book.availability === "Checked Out";

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div
          className="relative overflow-hidden rounded-[2.5rem] p-6 text-white shadow-[0_30px_90px_-35px_rgba(15,23,42,0.5)]"
        >
          <Image src={book.coverImage} alt={book.title} fill unoptimized className="object-cover" />
          <div
            className="absolute inset-0"
            style={{ background: `linear-gradient(150deg, ${book.coverStart}, ${book.coverEnd})`, opacity: 0.4 }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.22),_transparent_45%),radial-gradient(circle_at_left_bottom,_rgba(255,255,255,0.14),_transparent_40%)]" />
          <div className="relative space-y-5">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] backdrop-blur">
                {book.category}
              </span>
              <span className="rounded-full bg-black/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] backdrop-blur">
                {book.availability}
              </span>
            </div>
            <div className="mt-10 rounded-[2.25rem] border border-white/20 bg-white/10 p-8 backdrop-blur">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 overflow-hidden rounded-full border border-white/30 bg-white/15">
                  {book.providerPhoto ? (
                    <Image
                      src={book.providerPhoto}
                      alt={`${book.provider} profile`}
                      width={48}
                      height={48}
                      unoptimized
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-white">
                      {book.providerAvatar}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-white/75">{book.provider}</p>
                  <p className="text-xs uppercase tracking-[0.3em] text-white/60">Librarian</p>
                </div>
              </div>
              <h1 className="mt-4 max-w-xl text-4xl font-semibold tracking-tight md:text-6xl">
                {book.title}
              </h1>
              <p className="mt-4 max-w-xl text-base leading-8 text-white/85">{book.description}</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-panel rounded-[2rem] p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Book details</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-950">{book.author}</h2>
              </div>
              <div className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
                BDT {book.deliveryFee}
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                { label: "Status", value: book.availability, icon: BadgeCheck },
                { label: "Delivery fee", value: `BDT ${book.deliveryFee}`, icon: Truck },
                { label: "Rating", value: `${book.rating.toFixed(1)} / 5`, icon: Star },
                { label: "Added", value: book.addedAt, icon: BookMarked },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="rounded-[1.5rem] border border-slate-200 bg-white p-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                        <Icon className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{item.label}</p>
                        <p className="mt-1 font-semibold text-slate-950">{item.value}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/login"
                className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold ${
                  requestDisabled
                    ? "pointer-events-none bg-slate-200 text-slate-400"
                    : "bg-slate-950 text-white"
                }`}
              >
                <Truck className="h-4 w-4" />
                Request Delivery
              </Link>
              <button
                disabled={requestDisabled}
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 disabled:opacity-50"
              >
                <ArrowRight className="h-4 w-4" />
                Stripe checkout placeholder
              </button>
            </div>

            {requestDisabled ? (
              <div className="mt-4 flex items-center gap-3 rounded-[1.5rem] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                <Lock className="h-4 w-4" />
                This book is currently checked out, so delivery is disabled.
              </div>
            ) : null}
          </div>

        </div>
      </div>

      <div className="mt-12">
        <SectionHeading
          eyebrow="Reviews"
          title="Verified reviews from delivered orders."
        />
        <div className="mt-8">
          <ReviewPager reviews={reviews} />
        </div>
      </div>

      <div className="mt-12">
        <SectionHeading
          eyebrow="More picks"
          title="Similar books that feel right at home."
        />
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {similarBooks.map((item) => (
            <BookCard key={item.id} book={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
