"use client";

import { useMemo, useState } from "react";
import { BadgeCheck, ChevronLeft, ChevronRight, Star } from "lucide-react";

type Review = {
  id: string;
  user: string;
  date: string;
  rating: number;
  comment: string;
  verified?: boolean;
};

type ReviewPagerProps = {
  reviews: Review[];
};

const PAGE_SIZE = 3;

export function ReviewPager({ reviews }: ReviewPagerProps) {
  const [page, setPage] = useState(0);

  const totalPages = Math.max(1, Math.ceil(reviews.length / PAGE_SIZE));
  const currentReviews = useMemo(
    () => reviews.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE),
    [page, reviews]
  );

  const hasPrev = page > 0;
  const hasNext = page < totalPages - 1;

  if (!reviews.length) {
    return (
      <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-8 text-sm text-slate-600">
        No reviews yet. This title is ready for the first delivered reader review.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {currentReviews.map((review) => (
          <div
            key={review.id}
            className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_14px_40px_-28px_rgba(15,23,42,0.26)]"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-slate-950">{review.user}</p>
                <p className="text-sm text-slate-500">{review.date}</p>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
                <BadgeCheck className="h-4 w-4" />
                Verified
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1 text-amber-500">
              {Array.from({ length: review.rating }).map((_, index) => (
                <Star key={index} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-600">{review.comment}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-[1.5rem] border border-slate-200 bg-white px-4 py-3">
        <p className="text-sm text-slate-600">
          Showing {page * PAGE_SIZE + 1}–
          {Math.min((page + 1) * PAGE_SIZE, reviews.length)} of {reviews.length} reviews
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPage((current) => Math.max(0, current - 1))}
            disabled={!hasPrev}
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>
          <button
            type="button"
            onClick={() => setPage((current) => Math.min(totalPages - 1, current + 1))}
            disabled={!hasNext}
            className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
