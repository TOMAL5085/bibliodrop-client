import Link from "next/link";
import { ArrowRight, ShieldCheck, BookOpenText, ChartColumn } from "lucide-react";

export default function DashboardHomePage() {
  return (
    <div className="space-y-8">
      <div className="rounded-[2.5rem] bg-slate-950 p-8 text-white">
        <p className="text-sm uppercase tracking-[0.3em] text-white/55">Dashboard routes</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">
          Pick the role view you want to explore.
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
          The assignment calls for separate user, librarian, and admin dashboards. This landing
          page routes into each role-specific interface.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {[
          {
            href: "/dashboard/user",
            title: "User Dashboard",
            icon: ChartColumn,
            text: "Reading stats, delivery history, and review management.",
          },
          {
            href: "/dashboard/librarian",
            title: "Librarian Dashboard",
            icon: BookOpenText,
            text: "Inventory control, delivery status updates, and earnings.",
          },
          {
            href: "/dashboard/admin",
            title: "Admin Dashboard",
            icon: ShieldCheck,
            text: "Approvals, user roles, transactions, and platform oversight.",
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-[2rem] border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-[0_24px_60px_-30px_rgba(15,23,42,0.28)]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="mt-6 text-2xl font-semibold text-slate-950">{item.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">{item.text}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-950">
                Open view
                <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
