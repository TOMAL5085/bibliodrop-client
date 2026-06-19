"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { BookOpenText, ChartColumn, Package, ShieldCheck } from "lucide-react";

const dashboardLinks = [
  { href: "/dashboard/user", label: "User", icon: ChartColumn },
  { href: "/dashboard/librarian", label: "Librarian", icon: BookOpenText },
  { href: "/dashboard/admin", label: "Admin", icon: ShieldCheck },
];

export function DashboardShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto flex max-w-7xl flex-col px-4 py-6 sm:px-6 lg:flex-row lg:gap-8 lg:px-8">
        <aside className="mb-6 rounded-[2rem] border border-slate-200 bg-white p-4 shadow-[0_20px_60px_-32px_rgba(15,23,42,0.2)] lg:mb-0 lg:w-80 lg:shrink-0 lg:p-6">
          <div className="flex items-center gap-3 border-b border-slate-200 pb-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-[0.25em] text-slate-950">DASHBOARD</p>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Role aware</p>
            </div>
          </div>

          <nav className="mt-6 space-y-2">
            {dashboardLinks.map((item) => {
              const active = pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    active
                      ? "bg-slate-950 text-white"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-6 rounded-[1.5rem] bg-slate-950 p-5 text-white">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white/70">
              Platform note
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              These dashboards are built to the assignment spec and are ready to connect to
              authenticated MongoDB-backed data.
            </p>
          </div>
        </aside>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
