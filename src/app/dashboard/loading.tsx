export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="h-10 w-56 animate-pulse rounded-full bg-slate-200" />
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-28 animate-pulse rounded-[2rem] bg-slate-200" />
        ))}
      </div>
      <div className="mt-6 h-80 animate-pulse rounded-[2rem] bg-slate-200" />
    </div>
  );
}
