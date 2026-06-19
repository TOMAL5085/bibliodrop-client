import Link from "next/link";
import { BookOpen, Lock, Mail, ShieldCheck, Sparkles } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="mx-auto grid min-h-[calc(100vh-180px)] max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
      <div className="rounded-[2.5rem] bg-slate-950 p-8 text-white">
        <p className="text-sm uppercase tracking-[0.3em] text-white/55">Welcome back</p>
        <h1 className="mt-4 max-w-lg text-4xl font-semibold tracking-tight md:text-6xl">
          Sign in to request books, manage inventory, or approve deliveries.
        </h1>
        <p className="mt-5 max-w-xl text-sm leading-7 text-slate-300">
          The assignment calls for Better Auth, Google login, and JWT-backed protected routes.
          This interface is scaffolded for that integration.
        </p>

        <div className="mt-8 space-y-4">
          {[
            { icon: Sparkles, text: "Readers can track active deliveries and reading history." },
            { icon: BookOpen, text: "Librarians manage books and update request statuses." },
            { icon: ShieldCheck, text: "Admins keep the ecosystem clean and verified." },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.text} className="flex items-center gap-3 rounded-[1.5rem] bg-white/10 p-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15">
                  <Icon className="h-4 w-4" />
                </span>
                <p className="text-sm text-slate-300">{item.text}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="glass-panel rounded-[2.5rem] p-8">
        <form className="space-y-5">
          <div>
            <label className="text-sm font-medium text-slate-700">Email</label>
            <div className="mt-2 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
              <Mail className="h-4 w-4 text-slate-400" />
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full bg-transparent text-sm outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">Password</label>
            <div className="mt-2 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
              <Lock className="h-4 w-4 text-slate-400" />
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full bg-transparent text-sm outline-none"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded border-slate-300" />
              Remember me
            </label>
            <Link href="/register" className="font-semibold text-slate-950">
              Create an account
            </Link>
          </div>

          <button className="w-full rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white">
            Login
          </button>

          <div className="relative py-2 text-center text-sm text-slate-400">
            <span className="relative z-10 bg-white px-3">or continue with</span>
            <div className="absolute left-0 top-1/2 h-px w-full bg-slate-200" />
          </div>

          <button
            type="button"
            className="w-full rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700"
          >
            Continue with Google
          </button>
        </form>
      </div>
    </div>
  );
}
