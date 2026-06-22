import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen, Sparkles, Truck, Users } from "lucide-react";
import { BookCard } from "@/components/book-card";
import { SectionHeading } from "@/components/section-heading";
import {
  categories,
  providers,
  siteStats,
} from "@/lib/site-data";
import { getFeaturedBooksFromApi } from "@/lib/api";

export default async function HomePage() {
  const featuredBooks = await getFeaturedBooksFromApi();

  return (
    <div className="space-y-20 pb-20">
      <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-800">
              <Sparkles className="h-4 w-4" />
              Your local library, delivered
            </div>
            <div className="space-y-5">
              <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-slate-950 md:text-7xl">
                Books that move at the speed of your next great idea.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-600 text-balance">
                BiblioDrop connects readers with libraries and independent book owners, then
                turns checkout into a smooth doorstep delivery flow with role-based dashboards.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/browse-books"
                className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Browse Books
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-950 hover:text-slate-950"
              >
                Create Account
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {siteStats.map((stat) => (
                <div key={stat.label} className="glass-panel rounded-[1.75rem] p-5">
                  <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                  <p className="mt-3 text-3xl font-semibold text-slate-950">{stat.value}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{stat.note}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative animate-[fade-up_0.8s_ease-out]">
            <div className="absolute -left-8 top-10 h-28 w-28 rounded-full bg-amber-300/40 blur-3xl" />
            <div className="absolute -right-6 bottom-14 h-32 w-32 rounded-full bg-sky-300/40 blur-3xl" />
            <div className="glass-panel relative overflow-hidden rounded-[2.5rem] p-6 shadow-[0_30px_90px_-40px_rgba(15,23,42,0.35)]">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[2rem] bg-slate-950 p-6 text-white">
                  <p className="text-xs uppercase tracking-[0.3em] text-white/60">Delivery path</p>
                  <h2 className="mt-3 text-3xl font-semibold">Pending to doorstep</h2>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    Stripe-backed checkout, verified reviews, and status updates for every
                    request.
                  </p>
                </div>
                <div className="rounded-[2rem] border border-slate-200 bg-white p-6">
                  <div className="flex items-center justify-between">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Today</p>
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                      96% fulfilled
                    </span>
                  </div>
                  <div className="mt-8 space-y-4">
                    {[
                      "Readers browsing published books",
                      "Librarians approving new inventory",
                      "Admins auditing transactions",
                    ].map((item) => (
                      <div key={item} className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                          <BookOpen className="h-4 w-4" />
                        </span>
                        <p className="text-sm font-medium text-slate-700">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                {[
                  { label: "Checkout", value: "Stripe" },
                  { label: "Auth", value: "Better Auth" },
                  { label: "Uploads", value: "imgBB" },
                ].map((item) => (
                  <div key={item.label} className="rounded-[1.5rem] border border-slate-200 p-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{item.label}</p>
                    <p className="mt-2 text-lg font-semibold text-slate-950">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Featured books"
          title="A curated shelf of the latest published books."
          description="The homepage surfaces the freshest books first, with delivery fees, ratings, and provider details ready to explore."
        />

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {featuredBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Top librarians"
          title="Reliable providers with the most completed deliveries."
          description="These are the names users trust when they want their books packed carefully and delivered fast."
        />

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {providers.map((provider, index) => (
            <div
              key={provider.name}
              className="glass-panel rounded-[2rem] p-6"
            >
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 overflow-hidden rounded-3xl bg-slate-950">
                  <Image
                    src={provider.photo}
                    alt={provider.name}
                    width={64}
                    height={64}
                    unoptimized
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-lg font-semibold text-slate-950">{provider.name}</p>
                  <p className="text-sm text-slate-500">
                    {provider.city} • {provider.specialty}
                  </p>
                </div>
              </div>
              <div className="mt-6 flex items-end justify-between">
                <div>
                  <p className="text-sm text-slate-500">Completed deliveries</p>
                  <p className="mt-1 text-4xl font-semibold text-slate-950">
                    {provider.completedDeliveries}
                  </p>
                </div>
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                  #{index + 1}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Popular categories"
          title="Browse by mood, subject, or reading goal."
          description="Category cards are wired to the browse page filters so users can land directly on the shelf they want."
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/browse-books?category=${encodeURIComponent(category.name)}`}
              className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-[0_24px_60px_-30px_rgba(15,23,42,0.28)]"
            >
              <div className="relative h-40 overflow-hidden rounded-[1.5rem] bg-slate-100">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  unoptimized
                  quality={100}
                  className="object-cover object-center brightness-105 contrast-110 saturate-110 transition duration-500 group-hover:scale-105"
                />
                <div className={`absolute inset-0 bg-gradient-to-br ${category.accent} opacity-10`} />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.02),rgba(15,23,42,0.05))]" />
              </div>
              <p className="mt-5 text-xs uppercase tracking-[0.3em] text-slate-500">
                {category.slug}
              </p>
              <h3 className="mt-2 text-2xl font-semibold text-slate-950">{category.name}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{category.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section id="contact" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 rounded-[2.5rem] bg-slate-950 px-6 py-10 text-white lg:grid-cols-[1.1fr_0.9fr] lg:px-10">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.3em] text-white/50">Get started</p>
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Ready to browse, deliver, and manage local books in one place?
            </h2>
            <p className="max-w-2xl text-sm leading-7 text-slate-300">
              The website is structured around the assignment brief and is ready for the backend
              connection points you want to wire up next.
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row lg:flex-col">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-slate-950"
            >
              Create account
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/dashboard/admin"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white"
            >
              View dashboard
              <Users className="h-4 w-4" />
            </Link>
            <Link
              href="/browse-books"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white"
            >
              Browse books
              <Truck className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
