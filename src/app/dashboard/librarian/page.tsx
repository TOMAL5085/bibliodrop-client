import { ActivityBarChart } from "@/components/charts";
import { SectionHeading } from "@/components/section-heading";
import Link from "next/link";
import { chartData, dashboardMetrics, deliveryHistory, books } from "@/lib/site-data";

export default function LibrarianDashboardPage() {
  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Librarian dashboard"
        title="Manage inventory, deliveries, and earnings."
        description="Librarian tools focus on adding books, approving availability, and keeping requests moving."
      />

      <div className="grid gap-4 md:grid-cols-3">
        {dashboardMetrics.librarian.map((item) => (
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
          <form className="mt-6 space-y-4">
            {["Title", "Author", "Description", "Delivery fee", "Category", "imgBB URL"].map((label) => (
              <div key={label}>
                <label className="text-sm font-medium text-slate-700">{label}</label>
                {label === "Description" ? (
                  <textarea
                    rows={4}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                  />
                ) : (
                  <input
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                  />
                )}
              </div>
            ))}
            <button className="w-full rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white">
              Submit for approval
            </button>
          </form>
        </div>

        <div className="glass-panel rounded-[2rem] p-6">
          <h2 className="text-xl font-semibold text-slate-950">Request trend</h2>
          <div className="mt-6">
            <ActivityBarChart data={chartData.librarianTrend} />
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass-panel rounded-[2rem] p-6">
          <h2 className="text-xl font-semibold text-slate-950">Manage inventory</h2>
          <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white">
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
                {books.slice(0, 5).map((book) => (
                  <tr key={book.id} className="border-t border-slate-100">
                    <td className="px-4 py-4">
                      <p className="font-semibold text-slate-950">{book.title}</p>
                      <p className="text-slate-500">{book.category}</p>
                    </td>
                    <td className="px-4 py-4 text-slate-600">{book.status}</td>
                    <td className="px-4 py-4 text-slate-600">BDT {book.deliveryFee}</td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={`/books/${book.id}`}
                          className="rounded-full bg-slate-950 px-3 py-2 text-xs font-semibold text-white"
                        >
                          Edit
                        </Link>
                        <button className="rounded-full border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700">
                          Delete
                        </button>
                        <button className="rounded-full border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700">
                          Unpublish
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            These inventory actions stay inside the librarian dashboard, so public book pages stay
            clean while new librarian-added books still have edit, delete, and unpublish controls.
          </p>
        </div>

        <div className="glass-panel rounded-[2rem] p-6">
          <h2 className="text-xl font-semibold text-slate-950">Manage deliveries</h2>
          <div className="mt-6 space-y-4">
            {deliveryHistory.map((row) => (
              <div key={row.id} className="rounded-[1.5rem] border border-slate-200 bg-white p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-slate-950">{row.recipient}</p>
                    <p className="text-sm text-slate-500">{row.title}</p>
                  </div>
                  <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold text-white">
                    {row.status}
                  </span>
                </div>
                <p className="mt-3 text-sm text-slate-600">Update from pending to dispatched to delivered.</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
