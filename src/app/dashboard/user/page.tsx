"use client";

import { useEffect, useState } from "react";
import { TrendChart } from "@/components/charts";
import { SectionHeading } from "@/components/section-heading";
import {
  getSession,
  getDeliveriesFromApi,
  getAllBooksFromApi,
  getAllReviewsFromApi,
  type ApiDelivery,
  type ApiBook,
  type ApiReview,
} from "@/lib/api";
import toast from "react-hot-toast";

type DeliveryRow = {
  id: string;
  title: string;
  date: string;
  status: string;
  fee: number;
  bookId?: string;
};

type UserReview = {
  id: string;
  title: string;
  rating: number;
  comment: string;
  date: string;
};

type Metric = {
  label: string;
  value: string | number;
  delta: string;
};

export default function UserDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [deliveries, setDeliveries] = useState<DeliveryRow[]>([]);
  const [readingList, setReadingList] = useState<string[]>([]);
  const [reviews, setReviews] = useState<UserReview[]>([]);
  const [userEmail, setUserEmail] = useState<string>("");
  const [reviewingBookId, setReviewingBookId] = useState<string | null>(null);
  const [reviewFormData, setReviewFormData] = useState({ rating: 5, comment: "" });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const session = await getSession();
        if (!session?.user) return;
        const email = session.user.email.toLowerCase();
        setUserEmail(email);

        const allDeliveries = await getDeliveriesFromApi();
        const allBooks = await getAllBooksFromApi();

        // Filter user deliveries
        const myDeliveries = allDeliveries.filter(
          (d) => d.userEmail?.toLowerCase() === email
        );

        // Map deliveries
        const mappedDeliveries = myDeliveries.map((d) => {
          const book = allBooks.find((b) => b.id === d.bookId);
          return {
            id: d.id,
            title: book ? book.title : d.bookId,
            date: d.date,
            status: d.status,
            fee: d.amount,
            bookId: d.bookId,
          };
        });

        // Spent, Read, Pending
        const totalSpent = myDeliveries.reduce((sum, d) => sum + (d.amount || 0), 0);
        const deliveredCount = myDeliveries.filter((d) => d.status === "Delivered").length;
        const pendingCount = myDeliveries.filter((d) => d.status !== "Delivered").length;

        // Reading List
        const list = Array.from(
          new Set(
            myDeliveries
              .filter((d) => d.status === "Delivered")
              .map((d) => {
                const book = allBooks.find((b) => b.id === d.bookId);
                return book ? book.title : d.bookId;
              })
          )
        );

        const allReviews = await getAllReviewsFromApi();
        const myReviews = allReviews.filter((r) => r.userEmail?.toLowerCase() === email);

        const mappedReviews = myReviews.map((r) => {
          const book = allBooks.find((b) => b.id === r.bookId);
          return {
            id: r.id,
            title: book ? book.title : r.bookId,
            rating: r.rating,
            comment: r.comment,
            date: r.date || "Just now",
          };
        });

        setMetrics([
          { label: "Total books read", value: deliveredCount, delta: `${deliveredCount} total` },
          { label: "Pending deliveries", value: pendingCount, delta: `${pendingCount} active` },
          { label: "Total spent", value: `BDT ${totalSpent}`, delta: `BDT ${totalSpent} overall` },
        ]);

        setDeliveries(mappedDeliveries);
        setReadingList(list);
        setReviews(mappedReviews);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadData();

    function handleDeliveryChange() {
      loadData();
    }

    window.addEventListener("bibliodrop-delivery-changed", handleDeliveryChange);

    // Auto-refresh every 60 seconds to check for delivery status changes
    const interval = setInterval(loadData, 60000);

    return () => {
      window.removeEventListener("bibliodrop-delivery-changed", handleDeliveryChange);
      clearInterval(interval);
    };
  }, []);

  async function handleSubmitReview(bookId: string) {
    if (!reviewFormData.comment.trim()) {
      toast.error("Please write a comment");
      return;
    }

    setSubmittingReview(true);
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookId,
          userEmail,
          rating: reviewFormData.rating,
          comment: reviewFormData.comment,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.message || "Failed to submit review");
        return;
      }

      toast.success("Review submitted!");
      setReviewingBookId(null);
      setReviewFormData({ rating: 5, comment: "" });

      // Reload reviews
      const allReviews = await getAllReviewsFromApi();
      const myReviews = allReviews.filter((r) => r.userEmail?.toLowerCase() === userEmail);
      const allBooks = await getAllBooksFromApi();

      const mappedReviews = myReviews.map((r) => {
        const book = allBooks.find((b) => b.id === r.bookId);
        return {
          id: r.id,
          title: book ? book.title : r.bookId,
          rating: r.rating,
          comment: r.comment,
          date: r.date || "Just now",
        };
      });

      setReviews(mappedReviews);
    } catch (err) {
      console.error(err);
      toast.error("Error submitting review");
    } finally {
      setSubmittingReview(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm font-medium text-slate-500">Loading your reading snapshot...</p>
      </div>
    );
  }

  const hasHistory = deliveries.length > 0;
  const userTrendData = hasHistory
    ? [
        { name: "Mon", value: 1 },
        { name: "Tue", value: 2 },
        { name: "Wed", value: 2 },
        { name: "Thu", value: 3 },
        { name: "Fri", value: 3 },
        { name: "Sat", value: readingList.length },
      ]
    : [
        { name: "Mon", value: 0 },
        { name: "Tue", value: 0 },
        { name: "Wed", value: 0 },
        { name: "Thu", value: 0 },
        { name: "Fri", value: 0 },
        { name: "Sat", value: 0 },
      ];

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="User dashboard"
        title="Track your reading, deliveries, and reviews."
        description="Readers get a snapshot of delivery status, spending, and what has already been verified."
      />

      <div className="grid gap-4 md:grid-cols-3">
        {metrics.map((item) => (
          <div key={item.label} className="glass-panel rounded-[2rem] p-6">
            <p className="text-sm text-slate-500">{item.label}</p>
            <p className="mt-3 text-4xl font-semibold text-slate-950">{item.value}</p>
            <p className="mt-2 text-sm text-slate-600">{item.delta}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="glass-panel rounded-[2rem] p-6">
          <h2 className="text-xl font-semibold text-slate-950">Reading momentum</h2>
          <p className="mt-2 text-sm text-slate-600">A lightweight trend chart for quick status at a glance.</p>
          <div className="mt-6">
            <TrendChart data={userTrendData} />
          </div>
        </div>
        <div className="glass-panel rounded-[2rem] p-6">
          <h2 className="text-xl font-semibold text-slate-950">Recent deliveries</h2>
          <div className="mt-6 space-y-4 max-h-[350px] overflow-y-auto pr-1">
            {deliveries.length === 0 ? (
              <p className="text-sm text-slate-500 py-6 text-center">No recent deliveries found. Request a book delivery to see it here.</p>
            ) : (
              deliveries.map((row) => (
                <div key={row.id} className="rounded-[1.5rem] border border-slate-200 bg-white p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-slate-950">{row.title}</p>
                      <p className="text-sm text-slate-500">{row.date}</p>
                    </div>
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                      {row.status}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-slate-600">BDT {row.fee} spent for doorstep delivery.</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass-panel rounded-[2rem] p-6">
          <h2 className="text-xl font-semibold text-slate-950">My reading list</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {readingList.length === 0 ? (
              <p className="text-sm text-slate-500 col-span-2 py-6 text-center">No books read yet.</p>
            ) : (
              readingList.map((title) => (
                <div key={title} className="rounded-[1.5rem] border border-slate-200 bg-white p-4">
                  <p className="font-semibold text-slate-950">{title}</p>
                  <p className="mt-2 text-sm text-slate-600">Successfully delivered and ready to revisit.</p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="glass-panel rounded-[2rem] p-6">
          <h2 className="text-xl font-semibold text-slate-950">My reviews</h2>
          <div className="mt-6 space-y-4 max-h-[350px] overflow-y-auto pr-1">
            {reviews.length === 0 ? (
              <p className="text-sm text-slate-500 py-6 text-center">No reviews written yet.</p>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="rounded-[1.5rem] border border-slate-200 bg-white p-4">
                  <p className="font-semibold text-slate-950">{review.title}</p>
                  <p className="mt-1 text-sm text-slate-500">{review.date}</p>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{review.comment}</p>
                  <p className="mt-3 text-xs font-semibold uppercase tracking-[0.3em] text-amber-700">
                    {review.rating} stars
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="glass-panel rounded-[2rem] p-6">
        <h2 className="text-xl font-semibold text-slate-950">Write a review</h2>
        <p className="mt-2 text-sm text-slate-600">Share your thoughts about books you've received.</p>
        
        {reviewingBookId ? (
          <div className="mt-6 space-y-4 border-t border-slate-200 pt-6">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-slate-950">Rating</h3>
              <select
                value={reviewFormData.rating}
                onChange={(e) =>
                  setReviewFormData({ ...reviewFormData, rating: Number(e.target.value) })
                }
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
              >
                {[5, 4, 3, 2, 1].map((rating) => (
                  <option key={rating} value={rating}>
                    {rating} stars
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Your comment</label>
              <textarea
                value={reviewFormData.comment}
                onChange={(e) =>
                  setReviewFormData({ ...reviewFormData, comment: e.target.value })
                }
                placeholder="Share your thoughts..."
                className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                rows={4}
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleSubmitReview(reviewingBookId)}
                disabled={submittingReview}
                className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700 disabled:opacity-50"
              >
                {submittingReview ? "Submitting..." : "Submit review"}
              </button>
              <button
                onClick={() => {
                  setReviewingBookId(null);
                  setReviewFormData({ rating: 5, comment: "" });
                }}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-6 space-y-2">
            {deliveries
              .filter((d) => d.status === "Delivered")
              .filter((d) => !reviews.some((r) => r.title === d.title))
              .map((delivery) => (
                <button
                  key={delivery.id}
                  onClick={() => setReviewingBookId(delivery.bookId || "")}
                  className="block w-full rounded-lg border border-slate-200 bg-white p-4 text-left hover:bg-slate-50"
                >
                  <p className="font-semibold text-slate-950">{delivery.title}</p>
                  <p className="text-xs text-slate-500">Click to review</p>
                </button>
              ))}
            {deliveries.filter((d) => d.status === "Delivered" && !reviews.some((r) => r.title === d.title)).length === 0 && (
              <p className="text-sm text-slate-500 py-6 text-center">No unreviewed delivered books yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
