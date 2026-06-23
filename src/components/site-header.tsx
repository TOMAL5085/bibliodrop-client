"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronDown, Menu, X, LogIn, LogOut, UserCircle2 } from "lucide-react";
import { getSession, logoutUser } from "@/lib/api";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/browse-books", label: "Browse Books" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
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

    function handleAuthChange() {
      loadSession();
    }

    window.addEventListener("bibliodrop-auth-changed", handleAuthChange);

    return () => {
      active = false;
      window.removeEventListener("bibliodrop-auth-changed", handleAuthChange);
    };
  }, []);

  async function handleLogout() {
    await logoutUser();
    setUser(null);
    setStatus("unauthenticated");
    setAccountOpen(false);
    setMobileOpen(false);
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          onClick={() => {
            setAccountOpen(false);
            setMobileOpen(false);
            window.scrollTo({ top: 0, left: 0, behavior: "auto" });
          }}
          className="flex items-center gap-3"
        >
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
                onClick={() => setAccountOpen(false)}
                className={`text-sm font-medium transition ${
                  active ? "text-slate-950" : "text-slate-600 hover:text-slate-950"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {status === "authenticated" && user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setAccountOpen((value) => !value)}
                className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-3 py-2 transition hover:border-slate-950"
                aria-haspopup="menu"
                aria-expanded={accountOpen}
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
                <ChevronDown className="h-4 w-4 text-slate-400" />
              </button>
              <div
                className={`absolute right-0 top-full mt-3 w-56 rounded-3xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-950/5 transition duration-150 ${
                  accountOpen
                    ? "visible translate-y-0 opacity-100"
                    : "invisible translate-y-1 opacity-0"
                }`}
              >
                <Link
                  href={
                    user.role === "admin"
                      ? "/dashboard/admin"
                      : user.role === "librarian"
                        ? "/dashboard/librarian"
                        : "/dashboard/user"
                  }
                  onClick={() => setAccountOpen(false)}
                  className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
                >
                  <UserCircle2 className="h-4 w-4" />
                  Dashboard
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
                >
                  <LogOut className="h-4 w-4" />
                  Log out
                </button>
              </div>
            </div>
          ) : status === "loading" ? (
            <div className="h-10 w-40 animate-pulse rounded-full bg-slate-100" />
          ) : (
            <>
              <Link
                href="/login"
                onClick={() => setAccountOpen(false)}
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-950 hover:text-slate-950"
              >
                <LogIn className="h-4 w-4" />
                Login
              </Link>
              <Link
                href="/register/select"
                onClick={() => setAccountOpen(false)}
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
                  setAccountOpen(false);
                }}
                className="rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                {item.label}
              </Link>
            ))}
            {status === "authenticated" && user ? (
              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  onClick={() => setAccountOpen((value) => !value)}
                  className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3"
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
                  <div className="min-w-0 flex-1 text-left">
                    <p className="truncate text-sm font-medium text-slate-700">{user.name}</p>
                    <p className="truncate text-xs text-slate-500">{user.email}</p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                </button>
                {accountOpen ? (
                  <div className="rounded-2xl border border-slate-200 bg-white p-2">
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
                        setAccountOpen(false);
                      }}
                      className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
                    >
                      <UserCircle2 className="h-4 w-4" />
                      Dashboard
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
                    >
                      <LogOut className="h-4 w-4" />
                      Log out
                    </button>
                  </div>
                ) : null}
              </div>
            ) : status === "loading" ? (
              <div className="mt-2 h-12 rounded-full bg-slate-100" />
            ) : (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Link
                  href="/login"
                  onClick={() => {
                    setMobileOpen(false);
                    setAccountOpen(false);
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700"
                >
                  <LogIn className="h-4 w-4" />
                  Login
                </Link>
                <Link
                  href="/register/select"
                  onClick={() => {
                    setMobileOpen(false);
                    setAccountOpen(false);
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
