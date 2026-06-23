"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import Link from "next/link";
import { ActivityBarChart } from "@/components/charts";
import { SectionHeading } from "@/components/section-heading";
import { getSession, uploadImage } from "@/lib/api";
import toast from "react-hot-toast";

type BookRow = {
  id: string;
  title: string;
  author: string;
  category: string;
  status: string;
  deliveryFee: number;
};

type DeliveryRow = {
  id: string;
  title: string;
  recipient: string;
  status: string;
  fee: number;
};

type Metric = {
  label: string;
  value: string | number;
  delta: string;
};

type ApiBook = {
  id: string;
  author: string;
  deliveryFee: number;
  providerEmail?: string;
  provider?: string;
  title?: string;
  category?: string;
  status?: string;
};

type ApiDelivery = {
  id: string;
  librarianEmail?: string;
  userEmail?: string;
  bookId: string;
  status: string;
  amount: number;
};

export default function LibrarianDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [books, setBooks] = useState<BookRow[]>([]);
  const [deliveries, setDeliveries] = useState<DeliveryRow[]>([]);
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [uploadingCoverImage, setUploadingCoverImage] = useState(false);
  const [coverImageUrl, setCoverImageUrl] = useState("");

  async function loadData() {
    try {
      const session = await getSession();
      if (!session?.user) return;
      const email = session.user.email.toLowerCase();
      const name = session.user.name;
      setUserEmail(email);
      setUserName(name);

      // Fetch books
      const booksRes = await fetch("/api/books");
      const booksData = (await booksRes.json()) as { data?: ApiBook[] };
      const allBooks = booksData.data ?? [];

      // Filter librarian's books
      const myBooks = allBooks
        .filter(
          (b) =>
            b.providerEmail?.toLowerCase() === email ||
            b.provider?.toLowerCase() === name.toLowerCase()
        )
        .map((book) => ({
          id: book.id,
          title: book.title ?? "Untitled",
          author: book.author,
          category: book.category ?? "Uncategorized",
          status: book.status ?? "published",
          deliveryFee: book.deliveryFee,
        }));

      // Fetch deliveries
      const delRes = await fetch("/api/deliveries");
      const delData = (await delRes.json()) as { data?: ApiDelivery[] };
      const allDeliveries = delData.data ?? [];

      // Filter librarian's deliveries
      const myDeliveries = allDeliveries.filter(
        (d) => d.librarianEmail?.toLowerCase() === email
      );

      // Map deliveries
      const mappedDeliveries = myDeliveries.map((d) => {
        const book = allBooks.find((b) => b.id === d.bookId);
        return {
          id: d.id,
          recipient: d.userEmail ?? "Unknown reader",
          title: book?.title ?? d.bookId,
          status: d.status,
          fee: d.amount,
        };
      });

      // Calculate metrics
      const listedCount = myBooks.length;
      const pendingCount = myBooks.filter((b) => b.status === "pending_approval").length;
      const activeRequests = myDeliveries.filter((d) => d.status !== "Delivered").length;
      const totalEarnings = myDeliveries
        .filter((d) => d.status === "Delivered")
        .reduce((sum, d) => sum + (d.amount || 0), 0);

      setMetrics([
        { label: "Total books listed", value: listedCount, delta: `${pendingCount} pending approval` },
        { label: "Total earnings", value: `BDT ${totalEarnings}`, delta: `BDT ${totalEarnings} overall` },
        { label: "Active requests", value: activeRequests, delta: `${activeRequests} pending action` },
      ]);

      setBooks(myBooks);
      setDeliveries(mappedDeliveries);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, []);

  async function handleAddBook(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const title = String(formData.get("title") || "").trim();
    const author = String(formData.get("author") || "").trim();
    const description = String(formData.get("description") || "").trim();
    const deliveryFee = Number(formData.get("deliveryFee") || 100);
    const category = String(formData.get("category") || "Fiction").trim();
    const coverImage = coverImageUrl.trim();

    if (!title || !author) {
      toast.error("Title and author are required.");
      return;
    }

    try {
      const res = await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          author,
          description,
          deliveryFee,
          category,
          coverImage,
          provider: userName || "Librarian",
          providerEmail: userEmail,
        }),
      });

      if (res.ok) {
        toast.success("Book listed successfully.");
        event.currentTarget.reset();
        loadData();
      } else {
        toast.error("Failed to add book.");
      }
    } catch {
      toast.error("An error occurred. Please try again.");
    }
  }

  async function handleCoverImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    const file = input.files?.[0];
    if (!file) {
      return;
    }

    setUploadingCoverImage(true);
    try {
      const url = await uploadImage(file);
      if (!url) {
        toast.error("Cover image upload failed. Please try again.");
        return;
      }

      setCoverImageUrl(url);
      toast.success("Cover image uploaded.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Cover image upload failed.");
    } finally {
      setUploadingCoverImage(false);
      input.value = "";
    }
  }

  async function updateStatus(deliveryId: string, newStatus: string) {
    try {
      const res = await fetch("/api/deliveries", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: deliveryId, status: newStatus }),
      });

      if (res.ok) {
        toast.success(`Status updated to ${newStatus}.`);
        loadData();
      } else {
        toast.error("Failed to update status.");
      }
    } catch {
      toast.error("An error occurred. Please try again.");
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm font-medium text-slate-500">Loading your provider dashboard...</p>
      </div>
    );
  }

  const hasHistory = deliveries.length > 0;
  const librarianTrendData = hasHistory
    ? [
        { name: "Mon", value: 1 },
        { name: "Tue", value: 2 },
        { name: "Wed", value: 2 },
        { name: "Thu", value: 3 },
        { name: "Fri", value: deliveries.length },
        { name: "Sat", value: deliveries.filter(d => d.status === "Delivered").length },
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
        eyebrow="Librarian dashboard"
        title="Manage inventory, deliveries, and earnings."
        description="Librarian tools focus on adding books, approving availability, and keeping requests moving."
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

      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="glass-panel rounded-[2rem] p-6">
          <h2 className="text-xl font-semibold text-slate-950">Add a book</h2>
          <form className="mt-6 space-y-4" onSubmit={handleAddBook}>
            <div>
              <label className="text-sm font-medium text-slate-700">Title</label>
              <input name="title" required className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Author</label>
              <input name="author" required className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Description</label>
              <textarea name="description" rows={4} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Delivery fee</label>
              <input name="deliveryFee" type="number" defaultValue={100} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Category</label>
              <select name="category" className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none">
                <option value="Fiction">Fiction</option>
                <option value="Sci-Fi">Sci-Fi</option>
                <option value="Academic">Academic</option>
                <option value="Business">Business</option>
                <option value="History">History</option>
                <option value="Poetry">Poetry</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Cover Image</label>
              <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center">
                <label className="inline-flex w-full cursor-pointer items-center justify-center rounded-2xl border border-dashed border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 sm:w-auto">
                  {uploadingCoverImage ? "Uploading..." : coverImageUrl ? "Replace image" : "Upload image"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleCoverImageUpload}
                  />
                </label>
                {coverImageUrl ? (
                  <span className="break-all text-xs text-slate-500">{coverImageUrl}</span>
                ) : (
                  <span className="text-xs text-slate-500">Upload from your laptop to set the cover image.</span>
                )}
              </div>
            </div>
            <button type="submit" className="w-full rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition">
              Submit for approval
            </button>
          </form>
        </div>

        <div className="glass-panel rounded-[2rem] p-6">
          <h2 className="text-xl font-semibold text-slate-950">Request trend</h2>
          <div className="mt-6">
            <ActivityBarChart data={librarianTrendData} />
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass-panel rounded-[2rem] p-6">
          <h2 className="text-xl font-semibold text-slate-950">Manage inventory</h2>
          <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white max-h-[350px] overflow-y-auto">
            {books.length === 0 ? (
              <p className="text-sm text-slate-500 py-10 text-center">No books in your inventory. Add a book to get started!</p>
            ) : (
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Book</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Fee</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {books.map((book) => (
                    <tr key={book.id} className="border-t border-slate-100">
                      <td className="px-4 py-4">
                        <p className="font-semibold text-slate-950">{book.title}</p>
                        <p className="text-slate-500">{book.category}</p>
                      </td>
                      <td className="px-4 py-4 text-slate-600 capitalize">{book.status}</td>
                      <td className="px-4 py-4 text-slate-600">BDT {book.deliveryFee}</td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-2">
                          <Link
                            href={`/books/${book.id}`}
                            className="rounded-full bg-slate-950 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 transition"
                          >
                            View
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            These inventory actions stay inside the librarian dashboard, so public book pages stay
            clean while new librarian-added books still have view controls.
          </p>
        </div>

        <div className="glass-panel rounded-[2rem] p-6">
          <h2 className="text-xl font-semibold text-slate-950">Manage deliveries</h2>
          <div className="mt-6 space-y-4 max-h-[350px] overflow-y-auto pr-1">
            {deliveries.length === 0 ? (
              <p className="text-sm text-slate-500 py-10 text-center">No delivery requests for your books.</p>
            ) : (
              deliveries.map((row) => (
                <div key={row.id} className="rounded-[1.5rem] border border-slate-200 bg-white p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-slate-950">{row.title}</p>
                      <p className="text-xs text-slate-500">Recipient: {row.recipient}</p>
                    </div>
                    <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold text-white">
                      {row.status}
                    </span>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                    <p className="text-sm text-slate-600">BDT {row.fee}</p>
                    <div className="flex items-center gap-2">
                      {row.status === "Pending" && (
                        <button
                          type="button"
                          onClick={() => updateStatus(row.id, "Dispatched")}
                          className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 hover:border-slate-950 transition"
                        >
                          Dispatch
                        </button>
                      )}
                      {(row.status === "Pending" || row.status === "Dispatched") && (
                        <button
                          type="button"
                          onClick={() => updateStatus(row.id, "Delivered")}
                          className="rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold text-white hover:bg-slate-800 transition"
                        >
                          Deliver
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
