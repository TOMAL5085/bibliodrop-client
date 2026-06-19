"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { BookOpenText, Menu, X, LogIn, LogOut, LayoutDashboard } from "lucide-react";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/browse-books", label: "Browse Books" },
];

const dashboardItems = [
  { href: "/dashboard/user", label: "User Dashboard" },
  { href: "/dashboard/librarian", label: "Librarian Dashboard" },
  { href: "/dashboard/admin", label: "Admin Dashboard" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const currentDashboardLabel = useMemo(() => {
    const match = dashboardItems.find((item) => pathname.startsWith(item.href));
    return match?.label ?? "Dashboard";
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-950/20">
            <BookOpenText className="h-5 w-5" />
          </span>
          <span className="space-y-0.5">
            <span className="block text-base font-semibold tracking-[0.2em] text-slate-950">
              BIBLIODROP
            </span>
            <span className="block text-xs uppercase tracking-[0.28em] text-slate-500">
              Local library delivery
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition ${
                  active ? "text-slate-950" : "text-slate-600 hover:text-slate-950"
                }`}
              >
                {item.label}
              </Link>
            );
          })}

          <div className="group relative">
            <button className="flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-950">
              <LayoutDashboard className="h-4 w-4" />
              {currentDashboardLabel}
            </button>
            <div className="invisible absolute left-0 top-full mt-3 w-56 translate-y-1 rounded-3xl border border-slate-200 bg-white p-2 opacity-0 shadow-xl shadow-slate-950/5 transition duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
              {dashboardItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex rounded-2xl px-4 py-3 text-sm text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-950 hover:text-slate-950"
          >
            <LogIn className="h-4 w-4" />
            Login
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((value) => !value)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 text-slate-700 md:hidden"
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen ? (
        <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                {item.label}
              </Link>
            ))}
            {dashboardItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                {item.label}
              </Link>
            ))}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700"
              >
                <LogIn className="h-4 w-4" />
                Login
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileOpen(false)}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-4 py-3 text-sm font-medium text-white"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
