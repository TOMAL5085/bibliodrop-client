"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Menu, X, LogIn, LogOut, LayoutDashboard, UserCircle2 } from "lucide-react";
import { getSession, logoutUser } from "@/lib/api";

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
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [status, setStatus] = useState<"loading" | "authenticated" | "unauthenticated">(
    "loading"
  );
  const [user, setUser] = useState<{
    id: string;
    name: string;
    email: string;
    role: string;
    photoUrl?: string;
  } | null>(null);

  const currentDashboardLabel = useMemo(() => {
    const match = dashboardItems.find((item) => pathname.startsWith(item.href));
    return match?.label ?? "Dashboard";
  }, [pathname]);

  useEffect(() => {
    let active = true;

    async function loadSession() {
      const response = await getSession();

      if (!active) {
        return;
      }

      if (!response?.user) {
        setUser(null);
        setStatus("unauthenticated");
        return;
      }

      setUser(response.user);
      setStatus("authenticated");
    }

    loadSession();

    return () => {
      active = false;
    };
  }, []);

  async function handleLogout() {
    await logoutUser();
    setUser(null);
    setStatus("unauthenticated");
    setDashboardOpen(false);
    setMobileOpen(false);
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-[1.15rem] bg-slate-950 shadow-sm ring-1 ring-slate-200">
            <Image
              src="/bibliodrop-navbar-logo.png"
              alt="BiblioDrop logo"
              width={48}
              height={48}
              priority
              className="h-full w-full object-cover"
            />
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
                onClick={() => setDashboardOpen(false)}
                className={`text-sm font-medium transition ${
                  active ? "text-slate-950" : "text-slate-600 hover:text-slate-950"
                }`}
              >
                {item.label}
              </Link>
            );
          })}

          <div className="relative">
            <button
              type="button"
              onClick={() => setDashboardOpen((value) => !value)}
              className="flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-950"
              aria-haspopup="menu"
              aria-expanded={dashboardOpen}
            >
              <LayoutDashboard className="h-4 w-4" />
              {currentDashboardLabel}
            </button>
            <div
              className={`absolute left-0 top-full mt-3 w-56 rounded-3xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-950/5 transition duration-150 ${
                dashboardOpen
                  ? "visible translate-y-0 opacity-100"
                  : "invisible translate-y-1 opacity-0"
              }`}
            >
              {dashboardItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setDashboardOpen(false)}
                  className="flex rounded-2xl px-4 py-3 text-sm text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {status === "authenticated" && user ? (
            <>
              <Link
                href={user.role === "admin" ? "/dashboard/admin" : user.role === "librarian" ? "/dashboard/librarian" : "/dashboard/user"}
                onClick={() => setDashboardOpen(false)}
                className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-3 py-2 transition hover:border-slate-950"
              >
                {user.photoUrl ? (
                  <Image
                    src={user.photoUrl}
                    alt={user.name}
                    width={28}
                    height={28}
                    unoptimized
                    className="h-7 w-7 rounded-full object-cover"
                  />
                ) : (
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                    <UserCircle2 className="h-4 w-4" />
                  </span>
                )}
                <span className="max-w-32 truncate text-sm font-medium text-slate-700">
                  {user.name}
                </span>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </>
          ) : status === "loading" ? (
            <div className="h-10 w-40 animate-pulse rounded-full bg-slate-100" />
          ) : (
            <>
              <Link
                href="/login"
                onClick={() => setDashboardOpen(false)}
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-950 hover:text-slate-950"
              >
                <LogIn className="h-4 w-4" />
                Login
              </Link>
              <Link
                href="/register"
                onClick={() => setDashboardOpen(false)}
                className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                <LogOut className="h-4 w-4" />
                Register
              </Link>
            </>
          )}
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
                onClick={() => {
                  setMobileOpen(false);
                  setDashboardOpen(false);
                }}
                className="rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                {item.label}
              </Link>
            ))}
            {dashboardItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  setMobileOpen(false);
                  setDashboardOpen(false);
                }}
                className="rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                {item.label}
              </Link>
            ))}
            {status === "authenticated" && user ? (
              <div className="space-y-3 pt-2">
                <Link
                  href={
                    user.role === "admin"
                      ? "/dashboard/admin"
                      : user.role === "librarian"
                        ? "/dashboard/librarian"
                        : "/dashboard/user"
                  }
                  onClick={() => {
                    setMobileOpen(false);
                    setDashboardOpen(false);
                  }}
                  className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3"
                >
                  {user.photoUrl ? (
                    <Image
                      src={user.photoUrl}
                      alt={user.name}
                      width={28}
                      height={28}
                      unoptimized
                      className="h-7 w-7 rounded-full object-cover"
                    />
                  ) : (
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                      <UserCircle2 className="h-4 w-4" />
                    </span>
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-700">{user.name}</p>
                    <p className="truncate text-xs text-slate-500">{user.email}</p>
                  </div>
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-4 py-3 text-sm font-medium text-white"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </div>
            ) : status === "loading" ? (
              <div className="mt-2 h-12 rounded-full bg-slate-100" />
            ) : (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Link
                  href="/login"
                  onClick={() => {
                    setMobileOpen(false);
                    setDashboardOpen(false);
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700"
                >
                  <LogIn className="h-4 w-4" />
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => {
                    setMobileOpen(false);
                    setDashboardOpen(false);
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-4 py-3 text-sm font-medium text-white"
                >
                  <LogOut className="h-4 w-4" />
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}
