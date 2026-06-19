import { SkeletonCard } from "@/components/skeleton-card";

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="h-[540px] animate-pulse rounded-[2.5rem] bg-slate-200" />
        <div className="space-y-4">
          <div className="h-10 w-56 animate-pulse rounded-full bg-slate-200" />
          <div className="h-8 w-80 animate-pulse rounded-full bg-slate-200" />
          <div className="h-56 animate-pulse rounded-[2rem] bg-slate-200" />
        </div>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    </div>
  );
}
