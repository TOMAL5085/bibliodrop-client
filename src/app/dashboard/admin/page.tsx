import { CategoryPieChart, RevenueChart } from "@/components/charts";
import { SectionHeading } from "@/components/section-heading";
import { users } from "@/lib/server-state";
import { books, transactions } from "@/lib/site-data";

const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

function getMonthIndex(dateValue: string) {
  const month = new Date(`${dateValue}T00:00:00Z`).getUTCMonth();
  return Number.isNaN(month) ? 0 : month;
}

const totalUsers = users.length;
const totalBooks = books.length;
const publishedBooks = books.filter((book) => book.status === "published").length;
const pendingApproval = books.filter((book) => book.status === "pending_approval").length;
const checkedOutBooks = books.filter((book) => book.availability === "Checked Out").length;
const totalRevenue = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);

const categoryCounts = books.reduce<Record<string, number>>((accumulator, book) => {
  accumulator[book.category] = (accumulator[book.category] ?? 0) + 1;
  return accumulator;
}, {});

const categoryPie = Object.entries(categoryCounts).map(([name, value]) => ({
  name,
  value,
}));

const revenueTrend = monthLabels.map((name, monthIndex) => {
  const monthTransactions = transactions.filter(
    (transaction) => getMonthIndex(transaction.date) === monthIndex
  );

  return {
    name,
    books: monthTransactions.length,
    revenue: monthTransactions.reduce((sum, transaction) => sum + transaction.amount, 0),
  };
});

const pendingBooks = books.filter((book) => book.status === "pending_approval");

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Admin dashboard"
        title="Oversee users, books, approvals, and transactions."
        description="Admins see the current ecosystem: live inventory, user roles, review coverage, and revenue visibility."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <div className="glass-panel rounded-[2rem] p-6">
          <p className="text-sm text-slate-500">Total users</p>
          <p className="mt-3 text-4xl font-semibold text-slate-950">{totalUsers}</p>
          <p className="mt-2 text-sm text-slate-600">Seeded accounts across all roles</p>
        </div>
        <div className="glass-panel rounded-[2rem] p-6">
          <p className="text-sm text-slate-500">Total books</p>
          <p className="mt-3 text-4xl font-semibold text-slate-950">{totalBooks}</p>
          <p className="mt-2 text-sm text-slate-600">
            {publishedBooks} published, {pendingApproval} pending approval, {checkedOutBooks}{" "}
            checked out
          </p>
        </div>
        <div className="glass-panel rounded-[2rem] p-6">
          <p className="text-sm text-slate-500">Total revenue</p>
          <p className="mt-3 text-4xl font-semibold text-slate-950">BDT {totalRevenue}</p>
          <p className="mt-2 text-sm text-slate-600">From the current seeded transactions</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="glass-panel rounded-[2rem] p-6">
          <h2 className="text-xl font-semibold text-slate-950">Revenue trend</h2>
          <p className="mt-2 text-sm text-slate-500">
            This chart now follows the transaction records, so it matches the total revenue card.
          </p>
          <div className="mt-6">
            <RevenueChart data={revenueTrend} />
          </div>
        </div>

        <div className="glass-panel rounded-[2rem] p-6">
          <h2 className="text-xl font-semibold text-slate-950">Books by category</h2>
          <div className="mt-6">
            <CategoryPieChart data={categoryPie} />
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass-panel rounded-[2rem] p-6">
          <h2 className="text-xl font-semibold text-slate-950">Approval queue</h2>
          <div className="mt-6 space-y-4">
            {pendingBooks.length ? (
              pendingBooks.map((book) => (
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
              ))
            ) : (
              <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600">
                No books are waiting for approval right now.
              </div>
            )}
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
