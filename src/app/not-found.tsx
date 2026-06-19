import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-700">404</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">
        We could not find that page.
      </h1>
      <p className="mt-4 text-base leading-7 text-slate-600">
        The route may have moved, or the book you asked for is not published yet.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white"
      >
        Back to home
      </Link>
    </div>
  );
}
