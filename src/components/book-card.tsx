import Image from "next/image";
import Link from "next/link";
import { Book } from "@/lib/site-data";

export function BookCard({ book }: { book: Book }) {
  return (
    <article className="group h-full overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_20px_60px_-30px_rgba(15,23,42,0.3)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_80px_-24px_rgba(15,23,42,0.35)]">
      <div className="relative h-52 overflow-hidden">
        <Image src={book.coverImage} alt={book.title} fill unoptimized className="object-cover" />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(140deg, ${book.coverStart}, ${book.coverEnd})`,
            opacity: 0.34,
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.28),_transparent_42%),radial-gradient(circle_at_left_bottom,_rgba(255,255,255,0.14),_transparent_36%)]" />
        <div className="absolute left-5 top-5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-white backdrop-blur">
          {book.category}
        </div>
        <div className="absolute right-5 top-5 rounded-full border border-white/30 bg-black/10 px-3 py-1 text-xs font-medium text-white backdrop-blur">
          {book.availability}
        </div>
        <div className="absolute bottom-5 left-5 right-5">
          <p className="text-sm uppercase tracking-[0.35em] text-white/80">{book.provider}</p>
          <h3 className="mt-2 text-2xl font-semibold leading-tight text-white">{book.title}</h3>
        </div>
      </div>

      <div className="flex h-[calc(100%-13rem)] flex-col p-6">
        <div className="flex items-center justify-between text-sm text-slate-500">
          <span>{book.author}</span>
          <span className="font-semibold text-slate-950">BDT {book.deliveryFee}</span>
        </div>
        <p className="mt-4 min-h-24 flex-1 text-sm leading-7 text-slate-600">
          {book.description}
        </p>
        <div className="mt-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 overflow-hidden rounded-full bg-slate-950">
              {book.providerPhoto ? (
                <Image
                  src={book.providerPhoto}
                  alt={`${book.provider} profile`}
                  width={40}
                  height={40}
                  unoptimized
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-white">
                  {book.providerAvatar}
                </div>
              )}
            </div>
            <div className="text-xs text-slate-500">
              <p className="font-medium text-slate-950">{book.rating.toFixed(1)} rating</p>
              <p>{book.reviews} verified reviews</p>
            </div>
          </div>
          <Link
            href={`/books/${book.id}`}
            className="inline-flex items-center rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Details
          </Link>
        </div>
      </div>
    </article>
  );
}
