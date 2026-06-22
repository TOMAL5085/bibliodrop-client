"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { BookOpenText, ChartColumn, LogOut, Package, ShieldCheck, UserCircle2 } from "lucide-react";
import { getSession, logoutUser } from "@/lib/api";
import { getStoredAuthSession, subscribeAuthSessionChange } from "@/lib/auth-session";

type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  photoUrl?: string;
};

const dashboardLinks = [
  { href: "/dashboard/user", label: "User", icon: ChartColumn },
  { href: "/dashboard/librarian", label: "Librarian", icon: BookOpenText },
  { href: "/dashboard/admin", label: "Admin", icon: ShieldCheck },
];

const rolePathMap: Record<string, string> = {
  user: "/dashboard/user",
  librarian: "/dashboard/librarian",
  admin: "/dashboard/admin",
};

export function DashboardShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isAdminDashboard = pathname.startsWith("/dashboard/admin");
  const cachedSession = getStoredAuthSession();
  const [status, setStatus] = useState<"loading" | "authenticated" | "unauthenticated">(
    cachedSession.user ? "authenticated" : "loading"
  );
  const [user, setUser] = useState<SessionUser | null>(cachedSession.user);

  useEffect(() => {
    let active = true;

    const syncSessionFromCache = () => {
      if (!active) {
        return;
      }

      const session = getStoredAuthSession();
      setUser(session.user);
      setStatus(session.user ? "authenticated" : "loading");
    };

    async function loadSession() {
      const response = await getSession();

      if (!active) {
        return;
      }

      if (!response?.user) {
        if (!getStoredAuthSession().user) {
          setStatus("unauthenticated");
          setUser(null);
          router.replace(`/login?next=${encodeURIComponent(pathname)}`);
        }
        return;
      }

      setUser(response.user);
      setStatus("authenticated");

      const expectedPath = rolePathMap[response.user.role] ?? "/dashboard/user";
      if (pathname === "/dashboard") {
        router.replace(expectedPath);
        return;
      }

      if (pathname.startsWith("/dashboard/") && pathname !== expectedPath) {
        router.replace(expectedPath);
      }
    }

    const unsubscribe = subscribeAuthSessionChange(syncSessionFromCache);
    syncSessionFromCache();
    loadSession();

    return () => {
      active = false;
      unsubscribe();
    };
  }, [pathname, router]);

  const avatar = user?.photoUrl ? (
    <Image
      src={user.photoUrl}
      alt={user.name}
      width={40}
      height={40}
      unoptimized
      className="h-10 w-10 rounded-2xl object-cover"
    />
  ) : (
    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
      <UserCircle2 className="h-5 w-5" />
    </div>
  );

  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
          <div className="glass-panel max-w-lg rounded-[2rem] p-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-950 text-white">
              <Package className="h-6 w-6" />
            </div>
            <h1 className="mt-6 text-2xl font-semibold text-slate-950">
              {status === "loading" ? "Checking your session..." : "Redirecting to login..."}
            </h1>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              We&apos;re verifying your auth state before showing the dashboard.
            </p>
          </div>
        </div>
      </div>
    );
  }

  async function handleLogout() {
    await logoutUser();
    setUser(null);
    setStatus("unauthenticated");
    router.push("/login");
  }

  const currentUser = user as SessionUser;
  const visibleDashboardLinks = isAdminDashboard
    ? dashboardLinks.filter((item) => item.href === "/dashboard/admin")
    : dashboardLinks;
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

          <div className="mt-5 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-3">
              {avatar}
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-950">{currentUser.name}</p>
                <p className="truncate text-xs text-slate-500">{currentUser.email}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs uppercase tracking-[0.24em] text-slate-500">
              <span>Active role</span>
              <span className="rounded-full bg-slate-950 px-3 py-1 text-[10px] font-semibold text-white">
                {currentUser.role}
              </span>
            </div>
          </div>

          <nav className="mt-6 space-y-2">
            {visibleDashboardLinks.map((item) => {
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

          {!isAdminDashboard ? (
            <div className="mt-6 rounded-[1.5rem] bg-slate-950 p-5 text-white">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white/70">
                Session status
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Your dashboard now restores the authenticated user on refresh and keeps the role
                view aligned with the signed-in account.
              </p>
            </div>
          ) : null}

          <button
            type="button"
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-600 transition hover:border-slate-950 hover:text-slate-950"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </aside>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
