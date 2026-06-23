import Link from "next/link";
import { ArrowRight, BookOpenText, User } from "lucide-react";

const options = [
  {
    href: "/register?role=user",
    title: "Register as User",
    description: "For readers who want to browse, request, and review books.",
    icon: User,
  },
  {
    href: "/register?role=librarian",
    title: "Register as Librarian",
    description: "For librarians who manage books, delivery requests, and inventory.",
    icon: BookOpenText,
  },
];

export default function RegisterChoicePage() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-180px)] max-w-5xl items-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="w-full rounded-[2.5rem] border border-slate-200 bg-white/90 p-8 shadow-[0_30px_90px_-50px_rgba(15,23,42,0.35)] backdrop-blur">
        <p className="text-sm uppercase tracking-[0.35em] text-amber-700">Create account</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 md:text-6xl">
          How do you want to register?
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
          Choose the account type first. We&apos;ll send you to the register form with the role
          already selected, so you can continue with email or Google sign-in.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {options.map((option) => {
            const Icon = option.icon;

            return (
              <Link
                key={option.href}
                href={option.href}
                className="group rounded-[2rem] border border-slate-200 bg-slate-50 p-6 transition hover:-translate-y-1 hover:border-slate-950 hover:bg-white hover:shadow-[0_24px_60px_-30px_rgba(15,23,42,0.28)]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="mt-6 text-2xl font-semibold text-slate-950">{option.title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">{option.description}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-950">
                  Continue
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
