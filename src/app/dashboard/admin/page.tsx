import { CategoryPieChart, RevenueChart } from "@/components/charts";
import { SectionHeading } from "@/components/section-heading";
import { chartData, dashboardMetrics, books, transactions } from "@/lib/site-data";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Admin dashboard"
        title="Oversee users, books, approvals, and transactions."
        description="Admins see the whole ecosystem: approval queue, user roles, inventory, and revenue visibility."
      />

      <div className="grid gap-4 md:grid-cols-3">
        {dashboardMetrics.admin.map((item) => (
          <div key={item.label} className="glass-panel rounded-[2rem] p-6">
            <p className="text-sm text-slate-500">{item.label}</p>
            <p className="mt-3 text-4xl font-semibold text-slate-950">{item.value}</p>
            <p className="mt-2 text-sm text-slate-600">{item.delta}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="glass-panel rounded-[2rem] p-6">
          <h2 className="text-xl font-semibold text-slate-950">Revenue trend</h2>
          <div className="mt-6">
            <RevenueChart data={chartData.adminTrend} />
          </div>
        </div>

        <div className="glass-panel rounded-[2rem] p-6">
          <h2 className="text-xl font-semibold text-slate-950">Books by category</h2>
          <div className="mt-6">
            <CategoryPieChart data={chartData.categoryPie} />
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass-panel rounded-[2rem] p-6">
          <h2 className="text-xl font-semibold text-slate-950">Approval queue</h2>
          <div className="mt-6 space-y-4">
            {books
              .filter((book) => book.status === "pending_approval")
              .map((book) => (
                <div key={book.id} className="rounded-[1.5rem] border border-slate-200 bg-white p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-slate-950">{book.title}</p>
                      <p className="text-sm text-slate-500">
                        {book.author} • {book.category}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                        Approve & publish
                      </span>
                      <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">
                        Delete
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="glass-panel rounded-[2rem] p-6">
          <h2 className="text-xl font-semibold text-slate-950">Transactions</h2>
          <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Librarian</th>
                  <th className="px-4 py-3">Amount</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="border-t border-slate-100">
                    <td className="px-4 py-4 font-medium text-slate-950">{transaction.id}</td>
                    <td className="px-4 py-4 text-slate-600">{transaction.userEmail}</td>
                    <td className="px-4 py-4 text-slate-600">{transaction.librarianEmail}</td>
                    <td className="px-4 py-4 text-slate-600">BDT {transaction.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
